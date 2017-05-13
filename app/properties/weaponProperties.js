const projectileProperties = {
  missle: {
    attack: 3,
    quantity: 5,
    bulletSpeed: 1000,
    fireRate: 500,
    frames: {
      launch: [0],
    }
  },
  fireball: {
    attack: 1,
    quantity: 8,
    bulletSpeed: 350,
    fireRate: 250,
    frames: {
      launch: [0, 1, 2, 3],
    }
  }
}

export default projectileProperties
