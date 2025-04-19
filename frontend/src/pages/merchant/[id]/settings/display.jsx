import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import MerchantLayout from "@/components/layout/merchant.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ACCEPTED_IMAGE_MIME_TYPES,
  MAX_FILE_MB,
  MAX_FILE_SIZE,
} from "@/constants/file.js";
import { toast } from "sonner";
import { IconAlertCircle, IconPhotoQuestion, IconUpload, IconX } from "@tabler/icons-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { CardContent } from "@/components/ui/card.jsx";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.jsx";

const MAX_IMAGES = 8;

const FormSchema = z.object({
  banner: z
    .instanceof(File, {
      message: "Banner image is required",
    })
    .refine((files) => {
      return files;
    }, "Banner image is required")
    .refine((files) => {
      return files?.size <= MAX_FILE_SIZE;
    }, `Banner image must not be over ${MAX_FILE_MB}MB`)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.type),
      "Please recheck the supported file type again",
    ),
  images: z
    .array(
      z
        .instanceof(File)
        .refine(
          (file) => file?.size <= MAX_FILE_SIZE,
          `Image must be less than ${MAX_FILE_MB}MB`,
        )
        .refine(
          (file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file?.type),
          "Only JPEG, PNG, WebP, and GIF formats are supported",
        ),
    )
    .max(MAX_IMAGES, `You can upload a maximum of ${MAX_IMAGES} images`)
    .optional()
    .default([]),
});

function Page() {
  const { id } = useParams();

  const [bannerImagePreview, setBannerImagePreview] = useState(
    /** @type {File|null} */ null,
  );
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageErrors, setImageErrors] = useState([]);

  /** @type {import("react-hook-form").UseFormReturn<z.infer<typeof FormSchema>>} */
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      banner: undefined,
      images: [],
    },
  });

  const handleImagesChange = (e, onChange) => {
    setImageErrors([]);
    form.clearErrors("images");

    const files = Array.from(e.target.files);
    const currentImages = form.getValues("images") || [];

    if (currentImages.length + files.length > MAX_IMAGES) {
      form.setError("images", {
        type: "manual",
        message: `You can upload a maximum of ${MAX_IMAGES} images`
      });
      return;
    }

    const newImages = [...currentImages];
    const newPreviews = [...imagePreviews];
    const newErrors = [...imageErrors];

    files.forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        newErrors.push({
          name: file.name,
          message: `Image "${file.name}" must be less than ${MAX_FILE_MB}MB`
        });
      }
      else if (!ACCEPTED_IMAGE_MIME_TYPES.includes(file.type)) {
        newErrors.push({
          name: file.name,
          message: `Image "${file.name}" must be JPEG, PNG, WebP, or GIF format`
        });
      }
      else {
        newImages.push(file);

        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push({
            url: e.target.result,
            name: file.name,
            file: file,
            index: newPreviews.length
          });
          setImagePreviews([...newPreviews]);
        };
        reader.readAsDataURL(file);
      }
    });

    onChange(newImages);
    setImageErrors(newErrors);
  };

  const removeImage = (index) => {
    setImageErrors([]);
    form.clearErrors("images");

    const currentImages = form.getValues("images");
    const newImages = [...currentImages];
    newImages.splice(index, 1);
    form.setValue("images", newImages, { shouldValidate: true });

    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  /**
   * @param {ReturnType<typeof FormSchema["parse"]>} data
   */
  function onSubmitForm(data) {
    toast.message("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <MerchantLayout>
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Merchant Settings</h2>
          <Separator />
        </div>
        <div className="flex flex-col gap-12">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Display & Images</h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitForm)}
                className="space-y-8"
              >
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col items-start gap-4 lg:flex-row">
                    <div className="relative aspect-video w-full rounded bg-gray-100 lg:basis-4/12">
                      {bannerImagePreview ? (
                        <img
                          src={URL.createObjectURL(bannerImagePreview)}
                          alt="Uploaded Image"
                          className="absolute aspect-video h-full w-full rounded object-contain select-none"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <IconPhotoQuestion className="size-8 text-gray-400/50" />
                        </div>
                      )}
                    </div>
                    <FormField
                      control={form.control}
                      name="banner"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Banner</FormLabel>
                          <FormDescription>
                            This image will appear at the top of your place
                            page.
                          </FormDescription>
                          <FormControl>
                            <Input
                              type="file"
                              accept={ACCEPTED_IMAGE_MIME_TYPES.join(",")}
                              onChange={(e) => {
                                field.onChange(e.target.files?.[0]);
                                setBannerImagePreview(
                                  e.target.files?.[0] || null,
                                );
                              }}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormDescription>
                            Only .jpg, .jpeg, .png, and .webp formats are
                            supported. The recommended minimum size is 960x540
                            pixels, with an aspect ratio of 16:9.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field: { onChange, value, ...rest } }) => (
                      <FormItem>
                        <FormLabel className="text-xl font-semibold">
                          Promotional Images
                        </FormLabel>
                        <FormDescription>
                          These images will appear below your page description.
                          You can upload up to {MAX_IMAGES} images.
                        </FormDescription>
                        <FormControl>
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <Button
                                type="button"
                                variant="outline"
                                className="h-24 w-full border-dashed py-16"
                                onClick={() =>
                                  document
                                    .getElementById("image-upload")
                                    ?.click()
                                }
                                disabled={imagePreviews.length >= MAX_IMAGES}
                              >
                                <div className="flex flex-col items-center gap-2">
                                  <IconUpload className="size-6" />
                                  <span className="touch-device:hidden">Click to upload</span>
                                  <span className="not-touch-device:hidden">Tap to upload</span>
                                  <span className="text-xs text-gray-500">
                                    JPEG, PNG, WebP, GIF (max {MAX_FILE_MB}MB)
                                  </span>
                                  <FormMessage />
                                </div>
                              </Button>
                              <Input
                                id="image-upload"
                                type="file"
                                accept={ACCEPTED_IMAGE_MIME_TYPES.join(",")}
                                multiple
                                className="hidden"
                                onChange={(e) =>
                                  handleImagesChange(e, onChange)
                                }
                                {...rest}
                              />
                            </div>

                            {imageErrors.length > 0 && (
                              <Alert variant="destructive" className="bg-red-50">
                                <IconAlertCircle className="h-4 w-4" />
                                <AlertTitle>
                                  Some images couldn't be uploaded
                                </AlertTitle>
                                <AlertDescription className="space-y-2">
                                  <ul className="text-sm list-disc pl-5">
                                    {imageErrors.map((error, idx) => (
                                      <li key={idx}>{error.message}</li>
                                    ))}
                                  </ul>
                                </AlertDescription>
                              </Alert>
                            )}

                            <FormMessage />

                            {imagePreviews.length > 0 && (
                              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                {imagePreviews.map((preview, index) => (
                                  <div
                                    key={index}
                                    className="group relative overflow-hidden"
                                  >
                                    <div className="relative aspect-video overflow-hidden">
                                      <img
                                        src={preview.url}
                                        alt={`Preview ${index}`}
                                        className="h-full w-full object-cover rounded"
                                      />
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 size-6 opacity-80 hover:opacity-100"
                                        onClick={() => removeImage(index)}
                                      >
                                        <IconX className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <CardContent className="p-2">
                                      <p
                                        className="truncate text-xs"
                                        title={preview.name}
                                      >
                                        {preview.name}
                                      </p>
                                    </CardContent>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-4 md:flex-row">
                  <Button type="submit" className="w-full flex-1">
                    Save
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </MerchantLayout>
  );
}

export default Page;
