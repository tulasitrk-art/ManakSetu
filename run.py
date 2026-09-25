"""
One-Click Launcher for ManakSetu (AI-Powered Indian Standards Recommendation Engine)
Runs both FastAPI Backend (port 8000) and Next.js Frontend (port 3000) concurrently.
"""
import subprocess
import sys
import os
import signal
import time

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(root_dir, "frontend")

    print("=" * 68)
    print("  MANAKSETU: AI-POWERED INDIAN STANDARDS RECOMMENDATION ENGINE")
    print("=" * 68)
    print("[1/2] Starting FastAPI Backend on http://localhost:8000 ...")
    print("[2/2] Starting Next.js Frontend on http://localhost:3000 ...")
    print("\nPress CTRL+C at any time to gracefully stop both servers.\n")
    print("-" * 68)

    # Start backend process
    backend_cmd = [sys.executable, "-m", "uvicorn", "main:app", "--app-dir", "backend", "--port", "8000", "--reload"]
    backend_proc = subprocess.Popen(backend_cmd, cwd=root_dir)

    # Start frontend process
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    frontend_proc = subprocess.Popen([npm_cmd, "run", "dev"], cwd=frontend_dir)

    def signal_handler(sig, frame):
        print("\n\nShutting down ManakSetu services...")
        try:
            backend_proc.terminate()
            frontend_proc.terminate()
        except Exception:
            pass
        sys.exit(0)

    signal.signal(signal.SIGINT, signal_handler)

    try:
        while True:
            time.sleep(1)
            # Check if any process terminated unexpectedly
            if backend_proc.poll() is not None:
                print("Backend service stopped.")
                break
            if frontend_proc.poll() is not None:
                print("Frontend service stopped.")
                break
    except KeyboardInterrupt:
        signal_handler(None, None)

if __name__ == "__main__":
    main()
