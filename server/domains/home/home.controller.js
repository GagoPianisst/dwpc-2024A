// Action Methods for Home Domain
// Get "/"
// GET "/index"

const home = (req, res) => {
  const iconSet = ['⭐', '🤖', '🍉', '🐞', '🎄'];
  const icon = iconSet[Math.floor(Math.random() * iconSet.length)];
  res.render('index', { title: 'Express', icon });
};

export default {
  home,
};
