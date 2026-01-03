import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  Loader2, 
  ImageIcon, 
  Download, 
  Sparkles,
  X,
  Plus
} from "lucide-react";

interface MockupGeneratorProps {
  accessToken: string;
}

export const MockupGenerator = ({ accessToken }: MockupGeneratorProps) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [stylePrompt, setStylePrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload image files only.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setUploadedImages((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const generateMockup = async () => {
    if (uploadedImages.length === 0) {
      toast({
        title: "No images uploaded",
        description: "Please upload at least one image to create a mockup.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-mockup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            images: uploadedImages,
            stylePrompt: stylePrompt || "Create a beautiful, professional mockup presentation",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate mockup");
      }

      const data = await response.json();
      setGeneratedImage(data.image);

      toast({
        title: "Mockup generated!",
        description: "Your beautiful mockup is ready.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;

    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `mockup-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetForm = () => {
    setUploadedImages([]);
    setStylePrompt("");
    setGeneratedImage(null);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base font-medium">
            Upload Screenshots or Images
          </Label>
          
          <div
            className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium mb-1">Click to upload images</p>
            <p className="text-sm text-muted-foreground">
              PNG, JPG, or WEBP up to 10MB each
            </p>
          </div>
          
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {/* Uploaded Images Preview */}
        {uploadedImages.length > 0 && (
          <div className="space-y-3">
            <Label className="text-base font-medium">
              Uploaded Images ({uploadedImages.length})
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {uploadedImages.map((img, index) => (
                <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border border-border">
                  <img
                    src={img}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Label htmlFor="stylePrompt" className="text-base font-medium">
            Style Instructions
            <span className="text-muted-foreground font-normal ml-2">(optional)</span>
          </Label>
          <Textarea
            id="stylePrompt"
            placeholder="e.g., Modern device mockup with gradient background, floating shadows, professional SaaS presentation style..."
            value={stylePrompt}
            onChange={(e) => setStylePrompt(e.target.value)}
            className="min-h-[100px] resize-none"
            disabled={isGenerating}
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={generateMockup}
            disabled={isGenerating || uploadedImages.length === 0}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Mockup...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Mockup
              </>
            )}
          </Button>

          {(generatedImage || uploadedImages.length > 0) && (
            <Button variant="outline" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              New
            </Button>
          )}
        </div>
      </div>

      {/* Output Section */}
      <div className="space-y-6">
        {isGenerating && (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <h3 className="font-medium mb-2">Creating your mockup...</h3>
            <p className="text-sm text-muted-foreground">
              This may take a moment
            </p>
          </div>
        )}

        {generatedImage && !isGenerating && (
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                <span className="font-medium">Generated Mockup</span>
              </div>
              <Button variant="ghost" size="sm" onClick={downloadImage}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            <div className="p-4">
              <img
                src={generatedImage}
                alt="Generated mockup"
                className="w-full rounded-lg"
              />
            </div>
          </div>
        )}

        {!isGenerating && !generatedImage && (
          <div className="rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center">
            <ImageIcon className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-medium mb-2">Your mockup will appear here</h3>
            <p className="text-sm text-muted-foreground">
              Upload images and click "Generate Mockup" to create a beautiful presentation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
