import dynamic from "next/dynamic";
import { useContext } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../../context";
import Avatar from "antd/lib/avatar";
import Link from "next/link";

const People = ({ people, handleFollow, handleUnFollow, setShowDropdown, page }) => {
  const [state, setState] = useContext(UserContext);
  const router = useRouter();

  return (
    <ul className="list-group">
      {people.map((person, index) => (
        <li
          key={index}
          className={`list-group-item d-flex justify-content-between align-items-center ${
            page === "profile" ? "mb-2" : "mb-1"
          }`}
        >
          <div className="d-flex align-items-center">
            {person.image ? (
              <Avatar className="avatar rounded-circle bg-primary me-3" size={32} src={person.image.url} />
            ) : (
              <Avatar className="avatar rounded-circle bg-primary me-3">
                {person.name.charAt(0).toUpperCase()}
              </Avatar>
            )}
            <span
              className="pointer"
              onClick={() => {
                if (page === "profile") setShowDropdown(false);

                router.push(`/user/${person.username}`);
              }}
            >
              {person.name}
            </span>
          </div>
          {state && state.user && person.followers.includes(state.user._id) ? (
            <span className="badge bg-primary mx-3 rounded-pill pointer" onClick={() => {
              handleUnFollow(person)
              if(page=="profile")setShowDropdown(false);

            }}>
              Unfollow
            </span>
          ) : (
            <span className="badge bg-primary mx-3 rounded-pill pointer" onClick={() => {handleFollow(person)
            if(page=="profile")setShowDropdown(false);
            }}>
              Follow
            </span>
          )}
        </li>
      ))}
    </ul>
  );
};

export default People;
