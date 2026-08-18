import { BrowserCapabilityId, BrowserCapabilityResult } from "@/types/execution";

const CAPABILITY_METADATA: Record<
  BrowserCapabilityId,
  { name: string; unsupportedMessage: string; supportedMessage: string }
> = {
  webWorker: {
    name: "Web Workers",
    supportedMessage: "Web Workers are supported for background processing.",
    unsupportedMessage: "Web Workers are not supported in this browser.",
  },
  webCrypto: {
    name: "Web Cryptography API",
    supportedMessage: "Hardware-accelerated cryptographic operations supported.",
    unsupportedMessage: "Web Cryptography API is unavailable.",
  },
  clipboard: {
    name: "Async Clipboard API",
    supportedMessage: "Direct clipboard read/write is supported.",
    unsupportedMessage: "Async Clipboard API is not supported.",
  },
  fileSystem: {
    name: "File System Access API",
    supportedMessage: "Direct native file reading and writing supported.",
    unsupportedMessage: "File System Access API is not supported.",
  },
  canvas: {
    name: "Canvas 2D Context",
    supportedMessage: "HTML5 2D Canvas rendering supported.",
    unsupportedMessage: "HTML5 Canvas 2D context is unavailable.",
  },
  offscreenCanvas: {
    name: "OffscreenCanvas API",
    supportedMessage: "Background canvas rendering supported.",
    unsupportedMessage: "OffscreenCanvas is not supported in this browser.",
  },
  localStorage: {
    name: "Local Storage",
    supportedMessage: "Client-side synchronous key-value storage supported.",
    unsupportedMessage: "Local Storage is disabled or unavailable.",
  },
};

export function isCapabilitySupported(id: BrowserCapabilityId): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    switch (id) {
      case "webWorker":
        return typeof window.Worker !== "undefined";

      case "webCrypto":
        return Boolean(
          typeof window.crypto !== "undefined" && window.crypto.subtle
        );

      case "clipboard":
        return Boolean(
          typeof navigator !== "undefined" && navigator.clipboard
        );

      case "fileSystem":
        return (
          "showOpenFilePicker" in window ||
          "showSaveFilePicker" in window ||
          "showDirectoryPicker" in window
        );

      case "canvas": {
        if (typeof document === "undefined") return false;
        const canvas = document.createElement("canvas");
        return Boolean(canvas.getContext && canvas.getContext("2d"));
      }

      case "offscreenCanvas":
        return typeof window.OffscreenCanvas !== "undefined";

      case "localStorage": {
        try {
          const testKey = "__cap_test__";
          window.localStorage.setItem(testKey, testKey);
          window.localStorage.removeItem(testKey);
          return true;
        } catch {
          return false;
        }
      }

      default:
        return false;
    }
  } catch {
    return false;
  }
}

export function checkCapabilities(
  ids: BrowserCapabilityId[]
): BrowserCapabilityResult[] {
  return ids.map((id) => {
    const meta = CAPABILITY_METADATA[id] || {
      name: id,
      supportedMessage: "Capability supported.",
      unsupportedMessage: "Capability not supported.",
    };
    const supported = isCapabilitySupported(id);

    return {
      id,
      name: meta.name,
      supported,
      message: supported ? meta.supportedMessage : meta.unsupportedMessage,
    };
  });
}
