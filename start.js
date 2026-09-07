module.exports = {
  daemon: true,
  run: [
    {
      method: "shell.run",
      params: {
        venv: "env",
        // Force UTF-8 stdout/stderr so tqdm download progress bars don't crash
        // on Windows consoles using the legacy cp1252 codec (UnicodeEncodeError).
        env: {
          PYTHONUTF8: "1",
          PYTHONIOENCODING: "utf-8"
        },
        path: "app",
        message: [
          "python app.py"
        ],
        on: [{
          // Capture the local Gradio URL (e.g. http://127.0.0.1:7860)
          "event": "/(http:\\/\\/[0-9.:]+)/",
          "done": true
        }]
      }
    },
    {
      // Expose the captured URL to pinokio.js (Open Web UI menu item)
      method: "local.set",
      params: {
        url: "{{input.event[1]}}"
      }
    }
  ]
}
