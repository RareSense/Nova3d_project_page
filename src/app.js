const showcaseItems = [
  {
    title: "Chair",
    description: "Furniture example with separable seat, back, legs, and support structure.",
    media: "assets/showcase/chair.mp4"
  },
  {
    title: "Corn Gun",
    description: "Stylized tool object with clear barrel, body, handle, and accent parts.",
    media: "assets/showcase/corn-gun.mp4"
  },
  {
    title: "Dining Table Set",
    description: "Repeated furniture instances arranged as a coherent household assembly.",
    media: "assets/showcase/dining-table-set.mp4"
  },
  {
    title: "Full Computer Set",
    description: "Multi-object desk setup with monitor, keyboard, accessories, and grouped parts.",
    media: "assets/showcase/full-computer-set.mp4"
  },
  {
    title: "NVIDIA Blue Asset",
    description: "Complex generated object included as a non-textured showcase clip.",
    media: "assets/showcase/nvidia-blue.mp4"
  },
  {
    title: "Rover",
    description: "Vehicle/mechanical example with wheels, body frame, and mounted components.",
    media: "assets/showcase/rover.mp4"
  }
];

function posterFor(item) {
  return item.media.replace(/\.mp4$/i, ".jpg");
}

function initShowcase() {
  const viewer = document.getElementById("asset-viewer");
  if (!viewer) return;

  const stage = document.createElement("figure");
  stage.className = "viewer-stage";

  const video = document.createElement("video");
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.autoplay = true;
  video.preload = "auto";

  const caption = document.createElement("figcaption");
  const title = document.createElement("h3");
  const description = document.createElement("p");
  caption.append(title, description);
  stage.append(video, caption);

  const rail = document.createElement("div");
  rail.className = "viewer-rail";
  rail.setAttribute("role", "list");

  const buttons = showcaseItems.map((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "viewer-thumb";

    const thumb = document.createElement("img");
    thumb.src = posterFor(item);
    thumb.alt = "";
    thumb.loading = "lazy";

    const label = document.createElement("span");
    label.textContent = item.title;

    button.append(thumb, label);
    button.addEventListener("click", () => select(index));
    rail.append(button);
    return button;
  });

  function select(index) {
    const item = showcaseItems[index];
    buttons.forEach((button, i) => {
      button.classList.toggle("active", i === index);
      button.setAttribute("aria-pressed", String(i === index));
    });

    video.poster = posterFor(item);
    video.src = item.media;
    video.play().catch(() => {});
    title.textContent = item.title;
    description.textContent = item.description;
  }

  viewer.append(stage, rail);
  select(0);
}

function initAutoplayVideos() {
  document.querySelectorAll("video[data-autoplay-video]").forEach((video) => {
    const startTime = Number.parseFloat(video.dataset.startTime || "0.8");
    const playFromStartTime = () => {
      if (Number.isFinite(startTime) && video.duration > startTime) {
        video.currentTime = startTime;
      }
      video.play().catch(() => {});
    };

    video.muted = true;
    video.loop = false;
    video.addEventListener("loadedmetadata", playFromStartTime, { once: true });
    video.addEventListener("canplay", () => video.play().catch(() => {}), { once: true });
    video.addEventListener("ended", playFromStartTime);
  });
}

initShowcase();
initAutoplayVideos();
