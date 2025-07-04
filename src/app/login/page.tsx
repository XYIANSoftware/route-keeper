import { AuthForm } from '@/components/forms/AuthForm';
import { DatabaseStatus } from '@/components/common/DatabaseStatus';

export default function LoginPage() {
  return (
    <div>
      <AuthForm mode="login" />
      <DatabaseStatus />
    </div>
  );
}
