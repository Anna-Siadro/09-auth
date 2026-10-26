'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { updateMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './EditProfilePage.module.css';

export default function EditProfile() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);

  const handleSubmit = async (formData: FormData) => {
    const updatedUser = await updateMe({
      username: formData.get('username') as string,
    });
    setUser(updatedUser);
    router.push('/profile');
  };

  if (!user) return <p>Loading...</p>;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} action={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              className={css.input}
              defaultValue={user.username}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push('/profile')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
