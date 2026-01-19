function webglAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

if (!webglAvailable()) {
  document.body.innerHTML = `
    <div style="
      display:flex;
      align-items:center;
      justify-content:center;
      height:100vh;
      background:#111;
      color:white;
      font-family:Arial;
      text-align:center;
    ">
      <div>
        <h2>WebGL Not Supported</h2>
        <p>This device or browser cannot render 3D content.</p>
        <p>Please open this site on a desktop/laptop browser.</p>
      </div>
    </div>
  `;
  throw new Error("WebGL not supported");
}

alert("WebGL IS AVAILABLE");
