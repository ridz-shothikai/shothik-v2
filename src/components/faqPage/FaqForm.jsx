"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import useSnackbar from "../../hooks/useSnackbar";
import { useContactMutation } from "../../redux/api/auth/authApi";
import FormProvider from "../../resource/FormProvider";
import RHFTextField from "../../resource/RHFTextField";

// ----------------------------------------------------------------------

export default function FaqForm() {
  const enqueueSnackbar = useSnackbar();
  const [contact] = useContactMutation();

  const contactSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    subject: Yup.string().required("Subject is required"),
    message: Yup.string().required("Message is required"),
  });

  const defaultValues = {
    name: "",
    email: "",
    subject: "",
    message: "",
  };

  const methods = useForm({
    resolver: yupResolver(contactSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await contact(data).unwrap();
      enqueueSnackbar(`Submitted successfully!`);
      reset();
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Sorry, an unexpected error occurred.";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-3">
        <h4 className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
          Haven&apos;t found the right help?
        </h4>

        <RHFTextField fullWidth label="Your name" name="name" />

        <RHFTextField fullWidth label="Your e-mail address" name="email" />
        <RHFTextField fullWidth label="Subject" name="subject" />

        <RHFTextField
          fullWidth
          label="Enter your message here."
          multiline
          rows={4}
          name="message"
        />
        <Button
          type="submit"
          size="lg"
          variant="default"
          disabled={isSubmitting}
        >
          Submit Now
        </Button>
      </div>
    </FormProvider>
  );
}
