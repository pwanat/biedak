import { useClerk, useUser } from "@clerk/tanstack-react-start";


export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>

      {user && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {user.imageUrl && (
              <img
                src={user.imageUrl}
                alt="Profile"
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-600">
                {user.emailAddresses[0].emailAddress}
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            <p>
              <strong>User ID:</strong> {user.id}
            </p>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
