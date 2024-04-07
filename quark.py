import os
import math
import numpy as np

import lib.config
import lib.potential
import lib.electron
import lib.graphs
import lib.figlocation

import lib.quark.quark
import lib.quark.baryon

config = lib.config.Config(0.7, 10, 10, 2000, 2000, 10, 1)

potential = lib.potential.CoulombPotential(config)

particles = [lib.quark.baryon.Baryon(config)]

if not os.path.exists("output_images4"):
    os.makedirs("output_images4")

frames = []

for t in range(config.Nt):
    print(f"Time: {t}")

    graph = lib.graphs.GraphDisplay(config, figsize=(12, 8))

    for n in range(len(particles)):
        particle = particles[n]

        particle.draw(graph, potential, 2, 3, n)
        particle.propagate(potential.V, particles)

    filename = f"output_images4/frame_{t:03d}.png"
    graph.save(filename)

print("Done! Saved all images.")
