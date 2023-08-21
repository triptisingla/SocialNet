import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


export const getProfiles = async (req, res) => {
  try {
    let { name } = req.params;
    console.log(name)
    const users = await User.find({});
    console.log(users);

    if (!users)
      return res.status(201).json({ message: "users not found" });

    name = name.toLowerCase();
    name = name.replace(/\s+/g,'').trim();
    console.log(name)

    let data = users.filter((user) => {

      let userName = user.firstName +" "+ user.lastName;
      userName = userName.toLowerCase();
      userName = userName.replace(/\s+/g,'').trim();
      console.log(userName)
      if (userName == name)
        return true;
      return false;
    })

    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    if (id === friendId)
      return res.status().json({ message: err.message });

    const user = await User.findById(id);
    const friend = await User.findById(friendId);


    console.log(id, friendId)
    if (user.friends.includes(friendId)) {

      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);

    } else {
      user.friends.push(friendId);

      friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


