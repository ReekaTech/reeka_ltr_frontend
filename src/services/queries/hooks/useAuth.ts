import {
  changePassword,
  forgotPassword,
  logout,
  resendVerification,
  resetPassword,
  respondToInvitation,
  signin,
  signup,
  verifyEmail,
} from '@/services/api';

import { InvitationResponsePayload } from '@/services/api/schemas/auth';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';

export const useSignup = () => {
  return useMutation({
    mutationFn: signup,
    onError: (error: any) => {
      // Handle axios error object to extract the backend message
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const backendError =
          error.response.data?.message || error.response.data?.error;
        if (backendError) {
          toast.error(backendError);
          return;
        }
      }
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
    onError: (error: any) => {
      // Handle axios error object to extract the backend message
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const backendError =
          error.response.data?.message || error.response.data?.error;
        if (backendError) {
          toast.error(backendError);
          return;
        }
      }
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
    onError: (error: any) => {
      // Handle axios error object to extract the backend message
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const backendError =
          error.response.data?.message || error.response.data?.error;
        if (backendError) {
          toast.error(backendError);
          return;
        }
      }
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
    onError: (error: any) => {
      // Handle axios error object to extract the backend message
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const backendError =
          error.response.data?.message || error.response.data?.error;
        if (backendError) {
          toast.error(backendError);
          return;
        }
      }
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
    onError: (error: any) => {
      // Handle axios error object to extract the backend message
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const backendError =
          error.response.data?.message || error.response.data?.error;
        if (backendError) {
          toast.error(backendError);
          return;
        }
      }
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
    onError: (error: any) => {
      // Handle axios error object to extract the backend message
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const backendError =
          error.response.data?.message || error.response.data?.error;
        if (backendError) {
          toast.error(backendError);
          return;
        }
      }
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
    onError: (error: any) => {
      // Handle axios error object to extract the backend message
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const backendError =
          error.response.data?.message || error.response.data?.error;
        if (backendError) {
          toast.error(backendError);
          return;
        }
      }
      toast.error(error.message || 'Failed to logout');
    },
    onSuccess: () => {
      toast.success('Logged out successfully');
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    onError: (error: any) => {
      // Handle axios error object to extract the backend message
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const backendError =
          error.response.data?.message || error.response.data?.error;
        if (backendError) {
          toast.error(backendError);
          return;
        }
      }

      // Fallback error message
      toast.error(error.message || 'Failed to change password');
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
  });
};

export const useRespondToInvitation = () => {
  return useMutation({
    mutationFn: (data: InvitationResponsePayload) => respondToInvitation(data),
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to process invitation response',
      );
    },
    onSuccess: () => {
      toast.success('Invitation processed successfully');
    },
  });
};
