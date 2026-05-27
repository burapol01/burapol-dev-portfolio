import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <p className="text-8xl font-bold text-slate-800 mb-4 font-mono">404</p>
        <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto">
          This page doesn&apos;t exist. Maybe a broken link or a mistyped URL.
        </p>
        <Button href="/" variant="primary">
          Back to Home
        </Button>
      </div>
    </div>
  );
}
