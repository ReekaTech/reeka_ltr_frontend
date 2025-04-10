import {
  forgotPassword,
  logout,
  resendVerification,
  resetPassword,
  signin,
  signup,
  verifyEmail,
} from '../api/auth';

import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';

export const useSignup = () => {
  return useMutation({
    mutationFn: signup,
    onError: error => {
      toast.error(error.message || 'Failed to sign up');
    },
    onSuccess: () => {
      toast.success('Sign up successful');
    },
  });
};

export const useSignin = () => {
  return useMutation({
    mutationFn: signin,
    onError: error => {
      toast.error(error.message || 'Failed to sign in');
    },
    onSuccess: () => {
      toast.success('Sign in successful');
    },
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: verifyEmail,
    onError: error => {
      toast.error(error.message || 'Failed to verify email');
    },
    onSuccess: () => {
      toast.success('Email verified successfully');
    },
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationFn: resendVerification,
    onError: error => {
      toast.error(error.message || 'Failed to resend verification');
    },
    onSuccess: () => {
      toast.success('Verification email sent successfully');
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onError: error => {
      toast.error(error.message || 'Failed to send password reset email');
    },
    onSuccess: () => {
      toast.success('Password reset email sent successfully');
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
    onError: error => {
      toast.error(error.message || 'Failed to reset password');
    },
    onSuccess: () => {
      toast.success('Password reset successfully');
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
    onError: error => {
      toast.error(error.message || 'Failed to logout');
    },
    onSuccess: () => {
      toast.success('Logged out successfully');
    },
  });
};
