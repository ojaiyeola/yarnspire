"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type Tab = "creations" | "about";

interface Creation {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

function AddCreationModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (c: Omit<Creation, "id" | "createdAt">) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), description: description.trim() });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-zinc-200">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">
          New Creation
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Title
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your creation a name"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this creation about?"
              rows={3}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CreationsTab({ userId }: { userId: string }) {
  const [creations, setCreations] = useState<Creation[]>([]);
  const [showModal, setShowModal] = useState(false);

  const storageKey = `ys_creations_${userId}`;

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setCreations(JSON.parse(stored));
  }, [storageKey]);

  function addCreation(c: Omit<Creation, "id" | "createdAt">) {
    const next: Creation[] = [
      ...creations,
      {
        ...c,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      },
    ];
    setCreations(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  return (
    <>
      {showModal && (
        <AddCreationModal
          onClose={() => setShowModal(false)}
          onAdd={addCreation}
        />
      )}

      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-zinc-800">
            My Creations
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
          >
            <span className="text-lg leading-none">+</span>
            New Creation
          </button>
        </div>

        {creations.length === 0 ? (
          <button
            onClick={() => setShowModal(true)}
            className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-300 text-zinc-400 hover:border-indigo-400 hover:text-indigo-500 transition"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-2xl font-light">
              +
            </span>
            <span className="text-sm font-medium">Add your first creation</span>
          </button>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {creations.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200 flex flex-col gap-2"
              >
                <h3 className="font-semibold text-zinc-900 truncate">
                  {c.title}
                </h3>
                {c.description && (
                  <p className="text-sm text-zinc-500 line-clamp-2">
                    {c.description}
                  </p>
                )}
                <p className="mt-auto pt-2 text-xs text-zinc-400">
                  {new Date(c.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}

            <button
              onClick={() => setShowModal(true)}
              className="flex h-full min-h-[120px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-300 text-zinc-400 hover:border-indigo-400 hover:text-indigo-500 transition"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-2xl font-light">
                +
              </span>
              <span className="text-xs font-medium">Add creation</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function AboutTab({ name, email }: { name: string; email: string }) {
  return (
    <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 space-y-4 max-w-sm">
      <div>
        <p className="text-xs uppercase tracking-widest text-zinc-400 mb-0.5">
          Name
        </p>
        <p className="text-sm font-medium text-zinc-800 capitalize">{name}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-zinc-400 mb-0.5">
          Email
        </p>
        <p className="text-sm font-medium text-zinc-800">{email}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("creations");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading || !user) return null;

  const tabs: { id: Tab; label: string }[] = [
    { id: "creations", label: "Creations" },
    { id: "about", label: "About" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <span className="text-lg font-bold text-indigo-700">Yarnspire</span>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Avatar + name */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600 uppercase">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 capitalize">
              {user.name}
            </h1>
            <p className="text-sm text-zinc-500">{user.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-zinc-200 mb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-zinc-500 hover:text-zinc-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "creations" && <CreationsTab userId={user.email} />}
        {activeTab === "about" && (
          <AboutTab name={user.name} email={user.email} />
        )}
      </main>
    </div>
  );
}
