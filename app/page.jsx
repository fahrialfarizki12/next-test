import UsersLIst from "./UsersLIst";

const getUsers = async (search, page, limit) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/users?page=${page}&limit=${limit}&search=${search}`,
    { cache: "no-store" }
  );
  return response.json(); // Langsung return array
};

const UsersPage = async ({ searchParams }) => {
  const search = (await searchParams?.search) || "";
  const page = (await parseInt(searchParams?.page)) || 1;
  const limit = (await parseInt(searchParams?.limit)) || 5;

  const { users, totalPage } = await getUsers(search, page, limit);

  return (
    <UsersLIst
      DATA_USERS={users}
      search={search}
      page={page}
      limit={limit}
      total={totalPage}
    />
  );
};

export default UsersPage;
