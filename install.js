module.exports = {
  requires: {
    bundle: "ai"
  },
  run: [
    // Clone crispz-krea2 into the local app/ folder
    {
      method: "shell.run",
      params: {
        message: [
          "git clone https://github.com/mikecastrodemaria/crispz-krea2 app"
        ]
      }
    },
    // Install crispz-krea2 dependencies (core + extras) in a dedicated venv
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "uv pip install -r requirements.txt",
          "uv pip install -r requirements-extra.txt"
        ]
      }
    },
    // Face Swap tab dependencies (requirements-faceswap.txt).
    // insightface depends on the CPU 'onnxruntime', which shares its files with
    // 'onnxruntime-gpu': whichever is installed last wins. Installing both in one
    // resolution silently leaves the CPU build on top (no CUDAExecutionProvider),
    // so the runtime matching this machine is force-reinstalled last.
    // onnxruntime-gpu has no macOS/ROCm wheels -> plain onnxruntime elsewhere.
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "uv pip install \"insightface>=0.7\"",
          "uv pip install --force-reinstall --no-deps {{gpu === 'nvidia' ? 'onnxruntime-gpu' : 'onnxruntime'}}"
        ]
      }
    },
    // Install PyTorch (CUDA cu128 on NVIDIA / ROCm / MPS / CPU) cross-platform
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          venv: "env",
          path: "app"
        }
      }
    },
    // Verify the installed diffusers really exposes the Krea 2 pipelines.
    // Without them the app imports fine and only fails at the first render, which
    // is a confusing place to discover a dependency problem.
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "python -c \"from diffusers import Krea2Pipeline; print('Krea 2 pipeline OK')\""
        ]
      }
    },
    // Deduplicate the venv to save disk space
    {
      method: "fs.link",
      params: {
        venv: "app/env"
      }
    }
  ]
}
