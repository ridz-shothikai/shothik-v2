"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonOutlineSharpIcon from "@mui/icons-material/PersonOutlineSharp";
import { Button } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import useSnackbar from "../../hooks/useSnackbar";
import { useAffiliateMutation } from "../../redux/api/auth/authApi";
import RHFTextField from "../../resource/RHFTextField";

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
        <div className="mx-auto w-full max-w-full sm:max-w-[450px]">
          <div className="mb-4">
            <RHFTextField
              name="name"
              placeholder="Full Name"
              startAdornment={
                <div className="mr-2 flex items-center justify-center">
                  <PersonOutlineSharpIcon />
                </div>
              }
            />
          </div>
          <div className="mb-4">
            <RHFTextField
              name="email"
              placeholder="Email"
              startAdornment={
                <div className="mr-2 flex items-center justify-center">
                  <MailOutlineIcon />
                </div>
              }
            />
          </div>
          <Button
            data-umami-event="Form: Join the waitlist"
            variant="contained"
            size="large"
            type="submit"
            disabled={isSubmitting}
            sx={{
              width: "100%",
              fontSize: { xs: "14px", sm: "16px" },
            }}
          >
            Join the waitlist
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
