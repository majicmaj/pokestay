import { ISourceOptions } from "tsparticles-engine";

const getBackgroundParticles = (type: string | undefined): ISourceOptions => {
  const particleConfigs: Record<string, ISourceOptions> = {
    fire: {
      particles: {
        number: { value: 30 },
        color: { value: ["#FF4500", "#FF6347", "#FFD700"] },
        shape: { type: "triangle" },
        opacity: { value: { min: 0.4, max: 0.9 } },
        size: { value: { min: 3, max: 6 } },
        move: {
          enable: true,
          speed: 5,
          direction: "top",
          random: false,
          straight: false,
          outModes: "out",
        },
      },
    },
    water: {
      particles: {
        number: { value: 20 },
        color: { value: ["#1E90FF", "#00BFFF", "#ADD8E6"] },
        shape: { type: "circle" },
        opacity: { value: { min: 0.3, max: 0.8 } },
        size: { value: { min: 2, max: 3 } },
        move: {
          enable: true,
          speed: 18,
          direction: "bottom",
          // random: true,
          straight: true,
          outModes: "out",
        },
      },
    },
    grass: {
      particles: {
        number: { value: 40 },
        color: { value: ["#32CD32", "#90EE90", "#228B22"] },
        shape: { type: "polygon" },
        opacity: { value: { min: 0.5, max: 1 } },
        size: { value: { min: 3, max: 7 } },
        move: {
          enable: true,
          speed: 2,
          direction: "bottom-right",
          random: true,
          straight: false,
          outModes: "split",
        },
      },
    },
    electric: {
      particles: {
        number: { value: 100 },
        color: { value: ["#FFD700", "#FFEC8B", "#FFA500", "#00c5FF"] },
        shape: { type: "square" },
        opacity: { value: { min: 0, max: 0 } },
        size: { value: { min: 1, max: 1 } },
        move: {
          enable: true,
          speed: 30,
          direction: "none",
          random: true,
          straight: false,
          // outModes: "out",
        },
        links: {
          // blink: true,
          warp: true,
          opacity: 1,
          distance: 50,
          width: 3,
          color: "random",
          //  ['#FFD700', '#FFEC8B', '#FFA500', '#00A5FF'],
          consent: false,
          enable: true,
          trangles: {
            enable: true,
            frequency: 1,
          },
        },
      },
    },
    ice: {
      particles: {
        number: { value: 40 },
        color: { value: ["#00FFFF", "#87CEFA", "#B0E0E6"] },
        shape: { type: "circle" },
        opacity: { value: { min: 0.4, max: 0.8 } },
        size: { value: { min: 2, max: 5 } },
        move: {
          enable: true,
          speed: 2,
          direction: "bottom",
          random: true,
          straight: false,
          outModes: "out",
        },
      },
    },
    fighting: {
      particles: {
        number: { value: 20 },
        color: { value: ["#DC143C", "#B22222", "#8B0000"] },
        shape: { type: "square" },
        opacity: { value: { min: 0.6, max: 1 } },
        size: { value: { min: 3, max: 8 } },
        move: {
          enable: true,
          speed: 3,
          direction: "none",
          random: true,
          straight: false,
          outModes: "out",
        },
      },
    },
    poison: {
      particles: {
        number: { value: 30 },
        color: { value: ["#8A2BE2", "#9400D3", "#4B0082"] },
        shape: { type: "circle" },
        opacity: { value: { min: 0.4, max: 0.9 } },
        size: { value: { min: 2, max: 5 } },
        move: {
          enable: true,
          speed: 3,
          direction: "none",
          random: true,
          straight: false,
          outModes: "out",
        },
      },
    },
    ground: {
      particles: {
        number: { value: 20 },
        color: { value: ["#DEB887", "#D2B48C", "#A0522D"] },
        shape: { type: "square" },
        opacity: { value: { min: 0.5, max: 1 } },
        size: { value: { min: 4, max: 8 } },
        move: {
          enable: true,
          speed: 2,
          direction: "bottom",
          random: true,
          straight: false,
          outModes: "out",
        },
      },
    },
    flying: {
      particles: {
        number: { value: 25 },
        color: { value: ["#ADD8E6", "#87CEEB", "#6495ED"] },
        shape: { type: "circle" },
        opacity: { value: { min: 0.3, max: 0.7 } },
        size: { value: { min: 2, max: 5 } },
        move: {
          enable: true,
          speed: 20,
          direction: "top-right",
          random: true,
          straight: false,
          outModes: "out",
        },
      },
    },
    psychic: {
      particles: {
        number: { value: 30 },
        color: { value: ["#FF69B4", "#FFB6C1", "#FF1493"] },
        shape: { type: "polygon" },
        opacity: { value: { min: 0.4, max: 0.9 } },
        size: { value: { min: 3, max: 6 } },
        move: {
          enable: true,
          speed: 3,
          direction: "none",
          random: true,
          straight: false,
          outModes: "out",
        },
      },
    },
    bug: {
      particles: {
        number: { value: 40 },
        color: { value: ["#ADFF2F", "#7CFC00", "#32CD32"] },
        shape: { type: "circle" },
        opacity: { value: { min: 0.3, max: 0.8 } },
        size: { value: { min: 2, max: 5 } },
        move: {
          enable: true,
          speed: 3,
          direction: "none",
          // random: true,
          straight: false,
          outModes: "out",
          path: {
            clamp: false,
            enable: true,
            delay: {
              value: 0,
            },
            generator: "curvesPathGenerator",
          },
        },
      },
    },
    rock: {
      particles: {
        number: { value: 20 },
        color: { value: ["#BDB76B", "#8B4513", "#D2B48C"] },
        shape: { type: "square" },
        opacity: { value: { min: 0.4, max: 1 } },
        size: { value: { min: 3, max: 7 } },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: true,
          straight: false,
          outModes: "out",
        },
      },
    },
    ghost: {
      particles: {
        number: { value: 25 },
        color: { value: ["#9370DB", "#a99", "#544"] },
        shape: { type: "circle" },
        opacity: { value: { min: 0.3, max: 0.7 } },
        size: { value: { min: 2, max: 5 } },
        move: {
          enable: true,
          speed: 3,
          direction: "none",
          random: true,
          straight: false,
          outModes: "out",
        },
      },
    },
    dragon: {
      particles: {
        number: { value: 30 },
        color: { value: ["#7A2BE2", "#2255D3", "#22D3D3"] },
        shape: { type: "polygon" },
        opacity: { value: { min: 0.3, max: 0.9 } },
        size: { value: { min: 3, max: 6 } },
        move: {
          enable: true,
          speed: 4,
          direction: "none",
          random: true,
          straight: false,
          outModes: "out",
        },
      },
    },
    dark: {
      particles: {
        number: { value: 20 },
        color: { value: ["#7A2BE2", "#1A1B12", "#2A1B52"] },
        shape: { type: "circle" },
        opacity: { value: { min: 0.3, max: 0.7 } },
        size: { value: { min: 2, max: 5 } },
        move: {
          enable: true,
          speed: 3,
          direction: "none",
          random: true,
          straight: false,
          outModes: "out",
        },
      },
    },
    steel: {
      particles: {
        number: { value: 30 },
        color: { value: ["#E0E4EE", "#778899", "#A0C0E0"] },
        shape: { type: "square" },
        opacity: { value: { min: 0.5, max: 1 } },
        size: { value: { min: 3, max: 6 } },
        move: {
          enable: true,
          speed: 3,
          direction: "none",
          random: true,
          straight: false,
          outModes: "out",
        },
      },
    },
    fairy: {
      particles: {
        number: { value: 40 },
        color: { value: ["#FFB6C1", "#FFF0CB", "#FF69B4"] },
        shape: { type: "circle" },
        opacity: { value: { min: 0.5, max: 0.9 } },
        size: { value: { min: 3, max: 6 } },
        move: {
          enable: true,
          speed: 3,
          direction: "none",
          random: true,
          straight: false,
          outModes: "out",
        },
      },
    },
    normal: {
      particles: {
        number: { value: 40 },
        color: { value: ["#FFFFFF", "#aaaaaa", "#999999"] },
        shape: { type: "circle" },
        opacity: { value: { min: 0.5, max: 0.9 } },
        size: { value: { min: 3, max: 6 } },
        move: {
          enable: true,
          speed: 3,
          direction: "none",
          random: true,
          straight: false,
          outModes: "out",
        },
      },
    },
    evolution: {
      particles: {
        number: {
          value: 200,
          density: {
            enable: true,
          },
        },
        color: {
          value: ["#fff", "#FFD700"],
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: { min: 0.5, max: 1 },
          animation: {
            enable: true,
            speed: 2,
            sync: false,
          },
        },
        size: {
          value: { min: 1, max: 3 },
        },
        move: {
          enable: true,
          speed: 7,
          direction: "top",
          straight: true,
          outModes: {
            default: "destroy",
            top: "none",
          },
        },
      },
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "bubble",
          },
        },
        modes: {
          bubble: {
            distance: 40,
            duration: 2,
            opacity: 8,
            size: 6,
          },
        },
      },
      detectRetina: true,
    },
    default: {
      particles: {
        number: { value: 40 },
        color: { value: ["#FFFFFF", "#CCCCCC", "#FF69B4"] },
        shape: { type: "circle" },
        opacity: { value: { min: 0.5, max: 0.9 } },
        size: { value: { min: 3, max: 6 } },
        move: {
          enable: true,
          speed: 3,
          direction: "none",
          random: true,
          straight: false,
          outModes: "out",
        },
      },
    },
  };

  return {
    ...particleConfigs[type || "default"],
    interactivity: {
      events: {
        onClick: { enable: true, mode: "push" },
      },
      modes: {
        push: { quantity: 5 },
      },
    },
    detectRetina: true,
  };
};

export default getBackgroundParticles;
