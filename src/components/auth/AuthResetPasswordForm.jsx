"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Typography } from "@mui/material";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import useSnackbar from "../../hooks/useSnackbar";
import { useForgotPasswordMutation } from "../../redux/api/auth/authApi";
import {
  setShowLoginModal,
} from "../../redux/slice/auth";
import FormProvider from "../../resource/FormProvider";
import RHFTextField from "../../resource/RHFTextField";

// ----------------------------------------------------------------------

export default function AuthResetPasswordForm() {
  const enqueueSnackbar = useSnackbar();
  const [forgotPassword] = useForgotPasswordMutation();
  const [isSentMail, setIsSentMail] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  const ForgotSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
  });

  const defaultValues = {
    email: "",
  };

  const methods = useForm({
    resolver: yupResolver(ForgotSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    let payload = {
      email: data.email,
    };

    try {
      const result = await forgotPassword(payload);

      if (result?.data?.success) {
        dispatch(setShowLoginModal(false));
        enqueueSnackbar(
          "Reset password link sent to your email. Please check."
        );
      }

      if (result?.error) {
        setErrorMessage(result?.error?.data?.message);
        enqueueSnackbar(result?.error?.data?.message, { variant: "error" });
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "An unexpected error occurred.");
      reset();

      setError("afterSubmit", {
        ...error,
        message: error.message || error,
      });
    } finally {
      setIsSentMail(true);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <RHFTextField name="email" label="Email address" />
      {
        errorMessage &&
        <Typography
          variant="body2"
          color="error"
          sx={{ mt: 1, minHeight: '1.5em' }} // Added minHeight to reserve space
        >
          {errorMessage}
        </Typography>
      }

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{ mt: 3 }}
      >
        {isSentMail ? "Resend" : "Send"} Request
      </Button>
    </FormProvider>
  );
}
