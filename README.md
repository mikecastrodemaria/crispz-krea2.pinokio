# crispz-krea2.pinokio

1-click [Pinokio](https://pinokio.computer) launcher for
**[crispz-krea2](https://github.com/mikecastrodemaria/crispz-krea2)** — a
**Krea 2** creation studio (Fooocus-style, 100% local).

## What it does

Installs and launches crispz-krea2 in one click:

- **Install** — clones `mikecastrodemaria/crispz-krea2` into `app/`, creates a venv,
  installs the project requirements (`requirements.txt` +
  `requirements-extra.txt`), the Face Swap deps, and PyTorch (CUDA cu128 on
  NVIDIA / ROCm / MPS / CPU). Ends with a check that the installed diffusers really
  exposes `Krea2Pipeline`.
- **Start** — runs `python app.py` and opens the Gradio Web UI.
- **Update** — force-updates the launcher and the app to their `origin/main`,
  refreshes deps, reasserts the right torch build, re-runs the pipeline check.
- **Reset** — removes `app/` (and its venv) to reinstall from scratch.

## Features

txt2img · **pure-ESRGAN** upscale · single-file/Civitai checkpoints + LoRA
switching · styles · Describe / Improve prompt & Vision Mix (Ollama) · Remove BG ·
Face Swap · CLI + the crispz family CLI protocol v1 (`czp`).

> **No img2img, no inpaint.** Krea 2 has no img2img pipeline in diffusers, so the
> refine pass, inpaint and outpaint are unavailable here — the CLI protocol
> announces that honestly (`supports.img2img: false`, `inpaint: false`) rather
> than failing at call time. To refine or inpaint a Krea 2 image, pass it through
> **crispz-studio** or **crispz-krea**.

The base model is **`krea/Krea-2-Turbo`**, a 12.9B transformer quantized on the
fly with torchao. Measured on an RTX 5090: **1024×1024, 8 steps, 19.5 s,
22.8 GB VRAM**.

> ⚠️ **This model is gated on Hugging Face.** Before the first run, open
> <https://huggingface.co/krea/Krea-2-Turbo> and accept its licence, then give the app a
> **READ token from that same account** — `huggingface-cli login`, or `hf_token`
> in the app's `config.txt`. The two halves are separate: a token that works
> everywhere else still gets a `403 GatedRepoError` if the licence was accepted
> from a different account. `huggingface-cli whoami` tells you which account the
> app is actually using.

## Requirements

- [Pinokio](https://pinokio.computer) installed.
- An NVIDIA GPU with **>= 8 GB of VRAM** is recommended (tested on an RTX 5090 in
  native BF16). CPU / AMD / Apple are handled by the torch installer, but
  generation will be slow without CUDA.
- The app ships `default_cpu_offload: "model"`, which streams the weights and
  keeps the VRAM peak low at the cost of speed. On a large card, set it to `none`
  in the app's `config.txt` for a real speed-up.

## Optional: Face Swap & Ollama

- **Face Swap**: the Python deps (`insightface` + the ONNX runtime matching your
  GPU) are installed by Install/Update automatically. The **inswapper model is
  NOT downloaded** (its weights are not redistributable): drop
  `inswapper_128.onnx` into `app/faceswap/`, or set `faceswap_model_path` /
  `faceswap_model_url` in the app's `config.txt`.
- **Describe / Improve / Vision Mix** need a local [Ollama](https://ollama.com)
  with a vision model (e.g. `llava`, `qwen-vl`).

## Notes

- **One port for the whole family.** crispz apps all serve on 7860 by design
  ("no per-tool port"): the reply's `tool` field identifies who answered, not the
  port. Only run one crispz app at a time, or a `czp` call may reach a sibling.
- The app exposes the crispz family **CLI protocol v1** (JSON in, JSON out)
  through `czp.bat` / `czp.sh` in `app/`. See the app repo for the full contract.
- `app/`, `env/` and `logs/` are gitignored (created at install time).
- The app's `config.txt` is not in the repo. Without it the app reads
  `config-sample.txt`. Copy it to `config.txt` to customize.
