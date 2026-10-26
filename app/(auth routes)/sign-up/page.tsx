'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { register } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './SignUpPage.module.css';

export default function SignUp() {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);
  const [error, setError] = useState('');

  const handleSubmit = async (formData: FormData) => {
    try {
      setError('');
      const user = await register({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      });
      setUser(user);
      router.push('/profile');
    } catch (err) {
      setError(
        isAxiosError(err)
          ? (err.response?.data?.response?.message ?? err.message)
          : 'Registration failed'
      );
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} action={handleSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" className={css.input} required />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" className={css.input} required />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Register
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
