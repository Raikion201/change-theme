import "./App.css";
import { Gradient } from "whatamesh";
import { useEffect, useState, useRef, useId } from "react";
import { randomColor } from "randomcolor";
import clsx from "clsx";
import {
  useIdle,
  useToggle,
  useFullscreen,
  useLockBodyScroll,
  useMouseWheel,
} from "react-use";
import { IoPause, IoPlay } from "react-icons/io5";
import { GoMarkGithub } from "react-icons/go";
import { TbMaximizeOff, TbMaximize } from "react-icons/tb";
import { MdOutlineDarkMode, MdDarkMode } from "react-icons/md";
import { VscDebugStepBack } from "react-icons/vsc";
import { AiOutlineRobot, AiFillRobot } from "react-icons/ai";
import noiseGif from "./assets/noise.gif";

export default function () {
  const idCanvas = useId();

  const defaultColorPalette = ["#000000", "#111111", "#222222", "#333333"];

  const ref1 = useRef(new Gradient());

  const ref2 = useRef();

  const ref3 = useRef(useMouseWheel());

  const ref4 = useRef();

  const mouseWheel = useMouseWheel();

  const isIdle = useIdle(3e3);

  const [state, setState] = useState(defaultColorPalette);

  const [toggle1, setToggle1] = useToggle(true);

  const [toggle2, setToggle2] = useToggle(false);

  const [toggle3, setToggle3] = useToggle(false);

  const [toggle4, setToggle4] = useToggle(false);

  const Fn = {
    handle: {
      colorPalette: {
        set: function (parameter) {
          setState(randomColor({ ...parameter, count: 4 }));
          Fn.handle.gradient.refresh();
        },

        reset: function () {
          setState(defaultColorPalette);
          Fn.handle.gradient.refresh();
        },

        boolean: {
          isNotDefault: function () {
            return (
              JSON.stringify(state) !== JSON.stringify(defaultColorPalette)
            );
          },
        },

        color: {
          random: function () {
            Fn.handle.colorPalette.set({
              luminosity: "random",
              hue: "random",
            });
          },

          bright: function () {
            Fn.handle.colorPalette.set({ luminosity: "bright" });
          },

          light: function () {
            Fn.handle.colorPalette.set({ luminosity: "light" });
          },

          dark: function () {
            Fn.handle.colorPalette.set({ luminosity: "dark" });
          },

          monochrome: function () {
            Fn.handle.colorPalette.set({ hue: "monochrome" });
          },
        },

        mode: {
          random: {
            on: function () {
              Fn.handle.colorPalette.color.random();

              return (ref4.current = setInterval(
                () => Fn.handle.colorPalette.color.random(),
                3e3
              ));
            },

            off: function () {
              clearInterval(ref4.current);
            },
          },
        },
      },

      gradient: {
        refresh: function () {
          ref1.current.initGradient(`[id="${idCanvas}"]`);
          setToggle1(true); // ??
        },

        darkenTop: function () {
          setToggle3();
          Fn.handle.gradient.refresh();
        },
      },
    },
  };

  useFullscreen(ref2, toggle2, {
    onClose: () => setToggle2(false),
  });

  useLockBodyScroll(true);

  useEffect(() => {
    ref1.current.amp = new Date().getSeconds() % 2 === 0 ? 2e2 : 3e2;
    ref1.current.seed = new Date().getSeconds();
    Fn.handle.gradient.refresh();
  }, []);

  useEffect(() => {
    ref3.current !== mouseWheel && !toggle4
      ? Fn.handle.colorPalette.color.random()
      : undefined;
    ref3.current = mouseWheel;
  }, [mouseWheel]);

  useEffect(() => {
    toggle1 ? ref1.current.play() : ref1.current.pause();
  }, [toggle1]);

  useEffect(() => {
    toggle4 ? Fn.handle.colorPalette.mode.random.on() : undefined;

    return () => Fn.handle.colorPalette.mode.random.off();
  }, [toggle4]);

  return (
    <div
      className={clsx("flex flex-col", {
        "cursor-none": isIdle,
      })}
      ref={ref2}
    >
      <div
        className="pointer-events-none fixed inset-0 z-50 h-screen w-screen overflow-hidden bg-auto bg-center opacity-[.03]"
        style={{
          backgroundImage: `url("${noiseGif}")`,
        }}
      ></div>
      <canvas
        id={idCanvas}
        style={{
          "--gradient-color-1": state[0],
          "--gradient-color-2": state[1],
          "--gradient-color-3": state[2],
          "--gradient-color-4": state[3],
        }}
        className="h-screen w-screen"
        // https://github.com/jordienr/whatamesh/blob/c4dda98a1f72091817bbbb0c317e84e6bfce9a1d/src/components/editor.vue#L186
        data-js-darken-top={toggle3 ? "" : false}
        data-transition-in=""
      ></canvas>
      {!isIdle ? (
        <div className="fixed">
          <div className="fex-col flex h-screen w-screen p-7 md:p-10">
            <div className="flex w-full flex-col gap-y-1">
              <div className="flex flex-row items-baseline gap-x-0.5">
                <h1 className="text-5xl sm:first-letter:text-9xl">Whatamesh</h1>
                <div className="flex flex-row items-baseline text-sm sm:text-sm">
                  {!toggle4 ? (
                    <button
                      onClick={setToggle1}
                      title={!toggle1 ? "play" : "pause"}
                    >
                      {!toggle1 ? <IoPlay /> : <IoPause />}
                    </button>
                  ) : undefined}
                  <button onClick={setToggle2} title="toggle fullscreen">
                    {!toggle2 ? <TbMaximize /> : <TbMaximizeOff />}
                  </button>
                  <button
                    onClick={Fn.handle.gradient.darkenTop}
                    title="toggle darken top"
                  >
                    {toggle3 ? <MdDarkMode /> : <MdOutlineDarkMode />}
                  </button>
                  <button onClick={setToggle4} title="toggle random color mode">
                    {!toggle4 ? <AiOutlineRobot /> : <AiFillRobot />}
                  </button>
                  {Fn.handle.colorPalette.boolean.isNotDefault() && !toggle4 ? (
                    <button
                      onClick={Fn.handle.colorPalette.reset}
                      title="reset"
                    >
                      <VscDebugStepBack />
                    </button>
                  ) : undefined}
                </div>
              </div>
              <div className="flex h-full flex-col px-5 sm:px-12">
                {!toggle4 ? (
                  <div className="flex flex-col items-start gap-y-0.5 text-base sm:text-lg">
                    <button onClick={Fn.handle.colorPalette.color.random}>
                      random
                    </button>
                    <button onClick={Fn.handle.colorPalette.color.bright}>
                      bright
                    </button>
                    <button onClick={Fn.handle.colorPalette.color.light}>
                      light
                    </button>
                    <button onClick={Fn.handle.colorPalette.color.dark}>
                      dark
                    </button>
                    <button onClick={Fn.handle.colorPalette.color.monochrome}>
                      monochrome
                    </button>
                  </div>
                ) : undefined}
                <div className="flex grow flex-col items-end justify-end text-xl sm:text-2xl">
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : undefined}
    </div>
  );
}
