import { PARTICLES } from "./constants.js";
import { Electron } from "./electron.js";
import { Photon } from "./photon.js";
import { serialize_state } from "./serialization.js";

const state = {
  particles: [],
  config: {
    domain: {
      x: 10,
      y: 10,
      Nx: 1000,
      Ny: 1000,
      Nt: 2000,
      T_max: 10,
      potential: "coulomb"
    },
  },
};

let focused_particle = -1;

function switch_sidebar(particleID) {
  if (particleID > state.particles.length) {
    throw new Error("Particle ID too high");
  }
  focused_particle = particleID;
  render_sidebar();
}

function render_sidebar() {
  const sidebar = document.querySelector("#sidebar");
  if (focused_particle < 0) {
    sidebar.innerHTML = `
<h1 class="text-xl mb-4">Experiment config</h1>
<form id="config-form" class="flex flex-col gap-2">
  Size of the domain:
  <div class="flex flex-row gap-1">
  <input type="number" class="mb-4 border w-full" value="${state.config.domain.x}">
      x
  <input type="number" class="mb-4 border w-full" value="${state.config.domain.y}">
  </div>
  Resolution of the domain:
  <div class="flex flex-row gap-1">
  <input type="number" class="mb-4 border w-full" value="${state.config.domain.Nx}">
      x
  <input type="number" class="mb-4 border w-full" value="${state.config.domain.Ny}">
  </div>

  Length of simulation:
  <input type="number" class="mb-4 border w-full" value="${state.config.domain.T_max}">

  Number of time divisions
  <input type="number" class="mb-4 border w-full" value="${state.config.domain.Nt}">

  Potential function
  <select>
    <option value="coulomb">Central Coulomb potential</option>
    <option value="none">Empty potential field</option>
  </select>

</form>
`;
    const form = document.querySelector(`#config-form`);
    form.querySelectorAll("select")[0].value = state.config.domain.potential
     form.onchange = () => {
      state.config.domain.x = parseInt(form.querySelectorAll("input")[0].value);
      state.config.domain.y = parseInt(form.querySelectorAll("input")[1].value);
      state.config.domain.Nx = parseInt(
        form.querySelectorAll("input")[2].value,
      );
      state.config.domain.Ny = parseInt(
        form.querySelectorAll("input")[3].value,
      );
      state.config.domain.T_max = parseInt(
        form.querySelectorAll("input")[4].value,
      );
      state.config.domain.Nt = parseInt(
        form.querySelectorAll("input")[5].value,
      );
      state.config.domain.potential = 
        form.querySelectorAll("select")[0].value
      render_data();
    };

    return;
  }

  const particle = state.particles[focused_particle];
  switch (particle.__type) {
    case PARTICLES.ELECTRON: {
      sidebar.innerHTML = `
<h1 class="text-xl">Particle ${focused_particle}</h1>
<h1 class="mb-4">${particle.__type}</h1>
<form id="config-${focused_particle}" class="flex flex-col gap-2">
  Principal quantum number:
  <input type="number" class="mb-4 border" value="${particle.principal_quantum}">
  Azimuthal quantum number:
  <input type="number" class="mb-4 border" value="${particle.azimuthal_quantum}">
  Magnetic quantum number
  <input type="number" class="mb-4 border" value="${particle.magnetic_quantum}">
</form>
`;
      const form = document.querySelector(`#config-${focused_particle}`);
      form.onchange = () => {
        particle.principal_quantum = parseInt(
          form.querySelectorAll("input")[0].value,
        );
        particle.azimuthal_quantum = parseInt(
          form.querySelectorAll("input")[1].value,
        );
        particle.magnetic_quantum = parseInt(
          form.querySelectorAll("input")[2].value,
        );
        render_data();
      };
      break;
    }
    case PARTICLES.PHOTON: {
      sidebar.innerHTML = `
<h1 class="text-xl">Particle ${focused_particle}</h1>
<h1 class="mb-4">${particle.__type}</h1>
<form id="config-${focused_particle}" class="flex flex-col gap-2">
&sigma;:
  <input type="number" class="mb-4 border" value="${particle.sigma}">
x0, y0:
  <div class="flex flex-row gap-1">
  <input type="number" class="mb-4 border w-full" value="${particle.x0}">
      ,
  <input type="number" class="mb-4 border w-full" value="${particle.y0}">
  </div>
kx0, ky0:
  <div class="flex flex-row gap-1">
  <input type="number" class="mb-4 border w-full" value="${particle.kx0}">
      ,
  <input type="number" class="mb-4 border w-full" value="${particle.ky0}">
  </div>

</form>
`;
      const form = document.querySelector(`#config-${focused_particle}`);
      form.onchange = () => {
        particle.sigma = parseFloat(
          form.querySelectorAll("input")[0].value,
        );
        particle.x0 = parseFloat(
          form.querySelectorAll("input")[1].value,
        );
        particle.y0 = parseFloat(
          form.querySelectorAll("input")[2].value,
        );
        particle.kx0 = parseFloat(
          form.querySelectorAll("input")[3].value,
        );
        particle.ky0 = parseFloat(
          form.querySelectorAll("input")[4].value,
        );
        render_data();
      };
      break;
    }

    default:
      break;
  }
}

function render_data() {
  console.log(state);
  document.querySelector("#particles").replaceChildren([]);
  const div = document.createElement("div");
  div.classList.add(
    "cursor-pointer",
    "w-24",
    "h-24",
    "bg-[#101060]",
    "text-white",
    "grid",
    "place-content-center",
  );
  div.id = `config`;
  div.innerText = "FINITE SIMULATED SPACETIME";
  div.onclick = () => {
    switch_sidebar(-1);
  };
  document.querySelector("#particles").appendChild(div);
  state.particles.map((p, ix) => {
    const div = document.createElement("div");
    div.classList.add(
      ...p.__style,
      "cursor-pointer",
      "w-24",
      "h-24",
      "grid",
      "place-content-center",
    );
    div.id = `particle-${ix}`;
    div.onclick = () => {
      switch_sidebar(ix);
    };
    div.innerText = p.__type;
    document.querySelector("#particles").appendChild(div);
  });
  fetch(
    `/api/renderpreview?state=${serialize_state(state)}&req=${parseInt(Math.random() * 10000)}`,
  ).then((res) => {
    res.blob().then((blob) => {
      document
        .querySelector("#main-image-render")
        .setAttribute("src", URL.createObjectURL(blob));
      document.querySelector("#eta").innerText =
        `ETA: ${res.headers.get("X-ETA-To-Full-Animation")}`;
    });
  });
}

document.querySelector("#add-electron").onclick = () => {
  state.particles.push(new Electron(1, 0, 0));
  render_data();
};
document.querySelector("#add-photon").onclick = () => {
  state.particles.push(new Photon(0.5, 2.0, 2.0, 5.0, 5.0));
  render_data();
};

document.querySelector("#reload").onclick = () => {
  render_sidebar();
  render_data();
};

document.querySelector("#render").onclick = () => {
  fetch(
    `/api/render?state=${serialize_state(state)}&req=${parseInt(Math.random() * 10000)}`,
  ).then((res) => {
    res.json().then((json) => {
      window.location.assign(json.preview_url);
    });
  });
};

render_data();
render_sidebar();
