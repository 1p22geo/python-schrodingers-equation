import numpy as np
import uuid

import libschrodinger.config
import libschrodinger.figlocation
import libschrodinger.graphs


class Particle:
    """
    Base class for all particles
    """

    config: libschrodinger.config.Config
    """
    configuration for the domain
    """
    psi: np.ndarray
    """
    the wave function

    a `np.array` of shape `(config.Nx, config.Ny)`
    """
    _fig_opts: dict
    """
    Additional kwargs to `libschrodinger.graphs.GraphDisplay.add_figure`

    or to `matplotlib.pyplot`
    """
    _id: uuid.UUID
    """
    ID of the particle.
    """

    def __init__(self, config):
        self.config = config
        self.psi = np.zeros((config.Nx, config.Ny))
        self._fig_opts = {}

    def propagate(
        self,
        V: np.ndarray,
        particles: list["libschrodinger.particle.Particle"],
        frame: int,
    ) -> list["libschrodinger.particle.Particle"] | None:
        """
        propagate the wave function in a potential field

        Parameters
        ----------
        - `V: np.ndarray`
            - the potential field as an array
            of shape (Nx, Ny)
        - `particles: list[libschrodinger.particle.Particle]`
            - an array of other particles
            for inter-particle interactions

        """
        pass

    def draw(self, graph: "libschrodinger.graphs.GraphDisplay", V: np.ndarray, x, y, num):
        """
        Draws self as graphs (`3*num`, `3*num+1`, `3*num+2`)
        on an `x` by `y` figure in `graph`

        Or if this is particle number `num`
        and graphs are made on a `x` by `y` grid
        """
        graph.add_figure(
            libschrodinger.figlocation.FigureLocation(x, y, 3 * num),
            np.angle(self.psi),
            f"Phase (particle {num})",
            "color",
        )
        graph.add_figure(
            libschrodinger.figlocation.FigureLocation(x, y, 3 * num + 1),
            np.absolute(self.psi),
            f"Absolute (particle {num})",
            "3d",
        )

        graph.add_figure(
            libschrodinger.figlocation.FigureLocation(x, y, 3 * num + 2),
            V,
            f"Mean potential (particle {num})",
            "3d",
            zlim=(-1, 0),
            cmap=None,
        )
