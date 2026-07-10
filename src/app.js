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

function createMediaElement(item) {
  const mediaBox = document.createElement("div");
  mediaBox.className = "asset-media";

  const placeholder = document.createElement("div");
  placeholder.className = "asset-placeholder";
  placeholder.textContent = "Preview unavailable";

  mediaBox.append(placeholder);

  fetch(item.media, { method: "HEAD" })
    .then((response) => {
      if (!response.ok) return;

      const isVideo = item.media.toLowerCase().endsWith(".mp4");

      if (isVideo) {
        mediaBox.classList.add("video-enabled");
        mediaBox.tabIndex = 0;

        const poster = document.createElement("img");
        poster.src = item.media.replace(/\.mp4$/i, ".jpg");
        poster.alt = item.title;
        poster.className = "asset-poster";

        let video = null;

        const showVideo = () => {
          if (video) return;

          video = document.createElement("video");
          video.loop = true;
          video.muted = true;
          video.playsInline = true;
          video.preload = "auto";
          video.src = item.media;
          video.poster = poster.src;

          video.addEventListener(
            "loadedmetadata",
            () => {
              const seekTime = Number.isFinite(video.duration)
                ? Math.min(1.2, Math.max(0.35, video.duration * 0.35))
                : 0.5;
              video.currentTime = seekTime;
            },
            { once: true }
          );
          video.addEventListener("canplay", () => video.play().catch(() => {}));
          video.addEventListener("error", () => {
            if (video?.parentElement) {
              video.replaceWith(poster);
            }
            video = null;
          });

          poster.replaceWith(video);
        };

        const showPoster = () => {
          if (!video) return;
          video.pause();
          video.removeAttribute("src");
          video.load();
          if (video.parentElement) {
            video.replaceWith(poster);
          }
          video = null;
        };

        mediaBox.addEventListener("mouseenter", showVideo);
        mediaBox.addEventListener("mouseleave", showPoster);
        mediaBox.addEventListener("focusin", showVideo);
        mediaBox.addEventListener("focusout", showPoster);
        mediaBox.addEventListener("click", () => {
          if (video) {
            showPoster();
          } else {
            showVideo();
          }
        });
        mediaBox.append(poster);
      } else {
        const element = document.createElement("img");
        element.alt = item.title;

        element.addEventListener("error", () => {
          element.remove();
          placeholder.hidden = false;
        });

        element.src = item.media;
        mediaBox.append(element);
      }
      placeholder.hidden = true;
    })
    .catch(() => {
      placeholder.hidden = false;
    });

  return mediaBox;
}

function initShowcase() {
  const grid = document.getElementById("asset-grid");
  if (!grid) return;

  showcaseItems.forEach((item) => {
    const card = document.createElement("article");
    card.className = "asset-card";

    const body = document.createElement("div");
    body.className = "asset-card-body";
    body.innerHTML = `<h3>${item.title}</h3><p>${item.description}</p>`;

    card.append(createMediaElement(item), body);
    grid.append(card);
  });
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
