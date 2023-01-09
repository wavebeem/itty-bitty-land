import { useEffect } from "preact/hooks";
import { useSignal, useSignalEffect } from "@preact/signals";
import filledHeartURL from "./assets/heart-full.png";
import emptyHeartURL from "./assets/heart-empty.png";
import forestCreatureURL from "./assets/forest-creature.png";
import desertCreatureURL from "./assets/desert-creature.png";
import oceanCreatureURL from "./assets/ocean-creature.png";

type AppArea = "desert" | "forest" | "ocean";

function preloadImage(url: string): void {
  const img = document.createElement("img");
  img.src = url;
}

const creatures = {
  forest: forestCreatureURL,
  ocean: oceanCreatureURL,
  desert: desertCreatureURL,
} as const;

function clamp(x: number, min: number, max: number): number {
  if (x < min) return min;
  if (x > max) return max;
  return x;
}

export function App() {
  const palette = useSignal<AppArea>("desert");
  const happiness = useSignal(-1);
  const maxHappiness = 10;
  const filledHearts = happiness.value;
  const emptyHearts = maxHappiness - happiness.value;
  const year = new Date().getFullYear();

  function adjustHappiness(delta: number): void {
    happiness.value = clamp(happiness.value + delta, 0, maxHappiness);
  }

  // Update page theme
  useSignalEffect(() => {
    document.documentElement.dataset.palette = palette.value;
  });

  // Save happiness to localStorage
  useSignalEffect(() => {
    if (happiness.value < 0) {
      return;
    }
    localStorage.setItem("happiness", JSON.stringify(happiness.value));
  });

  // Load happiness from localStorage
  useEffect(() => {
    happiness.value = clamp(
      JSON.parse(localStorage.getItem("happiness") || "5"),
      0,
      maxHappiness
    );
  }, []);

  // Make happiness go down over time
  useEffect(() => {
    const interval = setInterval(() => {
      adjustHappiness(-1);
    }, 30 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Preload images to reduce flicker
  useEffect(() => {
    for (const img of [
      filledHeartURL,
      emptyHeartURL,
      forestCreatureURL,
      desertCreatureURL,
      oceanCreatureURL,
    ]) {
      preloadImage(img);
    }
  }, []);

  return (
    <div class="layout-flex-col-gap">
      <div class="bit-card layout-flex-col-gap">
        <h1>Itty Bitty Creatures</h1>
        <p>You can play with some itty bitty creatures here.</p>
        <p>
          They lose happiness every 30 seconds. You can make them happy by
          feeding them or playing with them.
        </p>
      </div>
      <div class="bit-card layout-flex-col-gap">
        <h2>Happiness</h2>
        <div class="layout-flex-wrap">
          {Array.from({ length: filledHearts }, () => (
            <img
              class="pixelated"
              width={8 * 8}
              height={8 * 8}
              src={filledHeartURL}
            />
          ))}
          {Array.from({ length: emptyHearts }, () => (
            <img
              class="pixelated"
              width={8 * 8}
              height={8 * 8}
              src={emptyHeartURL}
            />
          ))}
        </div>
        <div class="layout-flex-wrap-gap">
          <button
            type="button"
            class="bit-button"
            onClick={() => {
              adjustHappiness(1);
            }}
          >
            Feed
          </button>
          <button
            type="button"
            class="bit-button"
            onClick={() => {
              adjustHappiness(1);
            }}
          >
            Play
          </button>
        </div>
      </div>
      <div class="bit-card layout-flex-col-gap">
        <h2>Your creature</h2>
        <div class="layout-flex-row-center">
          <img
            class="pixelated layout-block"
            width={256}
            height={256}
            src={creatures[palette.value]}
          />
        </div>
      </div>
      <div class="bit-card layout-flex-col-gap">
        <h2>Choose a zone</h2>
        <div class="layout-flex-wrap-gap">
          <button
            type="button"
            class="bit-button"
            onClick={() => {
              palette.value = "forest";
            }}
          >
            Forest
          </button>
          <button
            type="button"
            class="bit-button"
            onClick={() => {
              palette.value = "desert";
            }}
          >
            Desert
          </button>
          <button
            type="button"
            class="bit-button"
            onClick={() => {
              palette.value = "ocean";
            }}
          >
            Ocean
          </button>
        </div>
      </div>
      <footer class="bit-card">
        &copy; {year}{" "}
        <a class="bit-link" href="https://wavebeem.com">
          Brian Mock
        </a>
        . Made with Preact and Vite. Hosted on Netlify.
      </footer>
    </div>
  );
}
