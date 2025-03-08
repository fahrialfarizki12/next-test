import UsersPage from "./UsersPage";

const HomePage = async () => {
  // Fetch data dari API
  const users = await fetch("https://crud-api-fahri.vercel.app/users/", {
    cache: "no-cache",
  })
    .then((res) => res.json())

    .catch((error) => {
      console.error("Error fetching data:", error);
      return [];
    });

  return <UsersPage users={users} />;
};

export default HomePage;
