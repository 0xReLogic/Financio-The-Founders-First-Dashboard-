import { account } from './appwrite';
import { ID, Models } from 'appwrite';

export interface User extends Models.User<Models.Preferences> {}

class AuthService {
  /**
   * Register new user with email & password
   * Sends verification email instead of auto-login
   */
  async register(email: string, password: string, name: string): Promise<User> {
    try {
      const user = await account.create(ID.unique(), email, password, name);
      console.log('✅ User registered:', user);
      
      // Send verification email
      try {
        const verificationUrl = `${window.location.origin}/verify-email`;
        await account.createVerification(verificationUrl);
        console.log('✅ Verification email sent to:', email);
      } catch (verifyError) {
        console.warn('⚠️ Could not send verification email:', verifyError);
        // Don't fail registration if email fails
      }
      
      return user;
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      throw new Error(error.message || 'Registration failed');
    }
  }

  /**
   * Login with email & password
   */
  async login(email: string, password: string): Promise<Models.Session> {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      console.log('✅ User logged in:', session);
      return session;
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      throw new Error(error.message || 'Login failed');
    }
  }

  /**
   * Get current logged-in user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await account.get();
      console.log('✅ Current user:', user);
      return user;
    } catch (error: any) {
      console.log('ℹ️ No user logged in:', error.message || 'Not authenticated');
      return null;
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await account.deleteSession('current');
      console.log('✅ User logged out');
    } catch (error: any) {
      console.error('❌ Logout failed:', error);
      throw new Error(error.message || 'Logout failed');
    }
  }

  /**
   * Send password recovery email
   */
  async resetPassword(email: string): Promise<void> {
    try {
      // Password recovery URL (will redirect to your app)
      const recoveryUrl = `${window.location.origin}/reset-password`;
      
      await account.createRecovery(email, recoveryUrl);
      console.log('✅ Recovery email sent to:', email);
    } catch (error: any) {
      console.error('❌ Password recovery failed:', error);
      throw new Error(error.message || 'Password recovery failed');
    }
  }

  /**
   * Complete password recovery with secret from email
   */
  async completePasswordRecovery(
    userId: string,
    secret: string,
    newPassword: string
  ): Promise<void> {
    try {
      await account.updateRecovery(userId, secret, newPassword);
      console.log('✅ Password updated successfully');
    } catch (error: any) {
      console.error('❌ Password update failed:', error);
      throw new Error(error.message || 'Password update failed');
    }
  }

  /**
   * Update user name
   */
  async updateName(name: string): Promise<User> {
    try {
      const user = await account.updateName(name);
      console.log('✅ Name updated:', user);
      return user;
    } catch (error: any) {
      console.error('❌ Name update failed:', error);
      throw new Error(error.message || 'Name update failed');
    }
  }

  /**
   * Update user email
   */
  async updateEmail(email: string, password: string): Promise<User> {
    try {
      const user = await account.updateEmail(email, password);
      console.log('✅ Email updated:', user);
      return user;
    } catch (error: any) {
      console.error('❌ Email update failed:', error);
      throw new Error(error.message || 'Email update failed');
    }
  }

  /**
   * Update user password
   */
  async updatePassword(newPassword: string, oldPassword: string): Promise<User> {
    try {
      const user = await account.updatePassword(newPassword, oldPassword);
      console.log('✅ Password updated');
      return user;
    } catch (error: any) {
      console.error('❌ Password update failed:', error);
      throw new Error(error.message || 'Password update failed');
    }
  }

  /**
   * Complete email verification with secret from email
   */
  async verifyEmail(userId: string, secret: string): Promise<void> {
    try {
      await account.updateVerification(userId, secret);
      console.log('✅ Email verified successfully');
    } catch (error: any) {
      console.error('❌ Email verification failed:', error);
      throw new Error(error.message || 'Email verification failed');
    }
  }

  /**
   * Check if user is logged in
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }
}

export const authService = new AuthService();
