"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Mail, User } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import useSnackbar from "../../hooks/useSnackbar";
import { useAffiliateMutation } from "../../redux/api/auth/authApi";
import RHFTextField from "../../resource/RHFTextField";
import { Button } from "@/components/ui/button";

export default function WaitlistForm({ userType }) {
  const enqueueSnackbar = useSnackbar();
  const [affiliate] = useAffiliateMutation();

  const schema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
  });

  const defaultValues = {
    name: "",
    email: "",
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        userType,
      };

      await affiliate(payload).unwrap();

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
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full max-w-full sm:max-w-[450px] mx-auto">
          <RHFTextField
            name="name"
            placeholder="Full Name"
            startAdornment={
              <div className="flex items-center justify-center mr-1">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
            }
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            className="w-full mb-2"
          />
          <RHFTextField
            name="email"
            placeholder="Email"
            startAdornment={
              <div className="flex items-center justify-center mr-1">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
            }
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            className="w-full mb-2"
          />
          <Button
            data-umami-event="Form: Join the waitlist"
            variant="default"
            size="lg"
            type="submit"
            disabled={isSubmitting}
            className="w-full text-sm sm:text-base"
          >
            Join the waitlist
          </Button>
        </div>
        </div>
      </form>
    </FormProvider>
  );
}
