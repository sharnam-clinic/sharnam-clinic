import { supabase } from '../utils/supabase';

export const authController = {
  async login(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // 1. Check in custom users table first
    const { data: user, error } = await supabase
      .from('users')
      .select('*, user_types(id, user_type)')
      .eq('email', email.trim().toLowerCase())
      .single();

    if (error || !user) {
      throw new Error('Invalid email or user not found');
    }

    if (user.is_status === 0) {
      throw new Error('Your account has been deactivated. Please contact your administrator.');
    }

    // Verify password (plain text check for seed or standard validation)
    if (user.password !== password) {
      throw new Error('Invalid password. Please try again.');
    }

    // Form user object
    const roleName = user.user_types?.user_type || 'Administrator';
    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      userType: user.user_type_id,
      role: roleName.toLowerCase().replace(/\s+/g, '_'),
      userTypeName: roleName,
    };

    // Generate local token
    const token = `sharnam-jwt-${user.id}-${Date.now()}`;

    return {
      accessToken: token,
      user: userProfile,
    };
  },

  async logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    return { success: true };
  },

  getCurrentUser() {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  }
};
