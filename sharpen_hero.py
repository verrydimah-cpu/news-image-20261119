# Hero-only unsharp-mask finish for entry.png.
#
# The finishing step of the render pipeline (invoked by render.mjs after
# the PIL downscale): the user's unsharp mask — the image blended with a
# Gaussian-blurred copy of itself, addWeighted(img, k, blur, -(k - 1), 0)
# with a 3.0-sigma blur — computed over the whole poster but composited
# back ONLY inside the hero-art rectangle. The rendered scene gains
# crisper tower windows, flag edges, the sun-glint path and promenade
# detail, while the masthead, caption, panels and ticker stay pixel for
# pixel what the typeset page produced — the same hero-only discipline
# as the sensor grain in poster.html.
#
# The hero-art box in the 1024x1024 final image: poster.html lays the
# poster out at 24px side padding; the .hero frame's 3px border sits at
# x 24..1000, y 116..119, and the art inside it is 970x246, so the art
# rectangle is x 27..997, y 119..365.
#
# Deterministic: fixed strength, fixed rectangle, OpenCV's PNG encoder
# at a fixed compression level — the same input yields the same bytes.
import os
import sys

import cv2

HERO_X0, HERO_Y0, HERO_X1, HERO_Y1 = 27, 119, 997, 365
STRENGTH = 1.4  # picked by inspection: crisp windows/flags, no halos
BLUR_SIGMA = 3.0


def sharpen_hero(path):
    img = cv2.imread(path, cv2.IMREAD_COLOR)
    if img is None:
        raise SystemExit(f"cannot read {path}")
    if img.shape[:2] != (1024, 1024):
        raise SystemExit(f"{path} is {img.shape[1]}x{img.shape[0]}, expected 1024x1024")

    blur = cv2.GaussianBlur(img, (0, 0), BLUR_SIGMA)
    sharp = cv2.addWeighted(img, STRENGTH, blur, -(STRENGTH - 1.0), 0)

    out = img.copy()
    out[HERO_Y0:HERO_Y1, HERO_X0:HERO_X1] = sharp[HERO_Y0:HERO_Y1, HERO_X0:HERO_X1]
    before = os.path.getsize(path)
    cv2.imwrite(path, out, [cv2.IMWRITE_PNG_COMPRESSION, 9])
    check = cv2.imread(path, cv2.IMREAD_COLOR)
    if check is None or check.shape[:2] != (1024, 1024):
        raise SystemExit(f"{path} did not survive the rewrite at 1024x1024")
    print(f"hero sharpened (k={STRENGTH}) -> {path} "
          f"({before} -> {os.path.getsize(path)} bytes)")


if __name__ == "__main__":
    sharpen_hero(sys.argv[1])
