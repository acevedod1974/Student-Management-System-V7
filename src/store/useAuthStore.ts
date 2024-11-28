import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface User {
  email: string;
  role: 'student' | 'teacher';
  studentId?: string;
}

interface AuthStore {
  user: User | null;
  studentPasswords: Record<string, string>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (email: string, oldPassword: string, newPassword: string) => boolean;
  isAuthenticated: boolean;
}

const TEACHER_CREDENTIALS = {
  email: 'dacevedo@unexpo.edu.ve',
  password: 'lfsbyrt2'
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      studentPasswords: {},
      login: async (email: string, password: string) => {
        // Teacher login
        if (email === TEACHER_CREDENTIALS.email) {
          if (password === TEACHER_CREDENTIALS.password) {
            set({
              user: { email, role: 'teacher' },
              isAuthenticated: true,
            });
            Cookies.set('userRole', 'teacher');
            return true;
          }
          return false;
        }
        
        // Student login
        const { studentPasswords } = get();
        if (studentPasswords[email] && studentPasswords[email] === password) {
          set({
            user: {
              email,
              role: 'student',
              studentId: email
            },
            isAuthenticated: true,
          });
          Cookies.set('userRole', 'student');
          return true;
        } else if (!studentPasswords[email] && password === 'student123') {
          // First-time login with default password
          set((state) => ({
            user: {
              email,
              role: 'student',
              studentId: email
            },
            isAuthenticated: true,
            studentPasswords: {
              ...state.studentPasswords,
              [email]: password
            }
          }));
          Cookies.set('userRole', 'student');
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
        Cookies.remove('userRole');
      },
      changePassword: (email: string, oldPassword: string, newPassword: string) => {
        const { studentPasswords } = get();
        if (studentPasswords[email] === oldPassword || oldPassword === 'student123') {
          set((state) => ({
            studentPasswords: {
              ...state.studentPasswords,
              [email]: newPassword
            }
          }));
          return true;
        }
        return false;
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);