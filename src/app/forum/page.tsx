'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Database } from '@/types/database'
import Link from 'next/link'

type ForumPost = Database['public']['Tables']['forum_posts']['Row'] & {
  users: Database['public']['Tables']['users']['Row']
  assets?: Database['public']['Tables']['assets']['Row']
  stacks?: Database['public']['Tables']['stacks']['Row']
}

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('forum_posts')
      .select(`
        *,
        users (id, name, avatar_url),
        assets (id, title),
        stacks (id, name)
      `)
      .order('created_at', { ascending: false })

    if (data) {
      setPosts(data)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Community Forum</h1>
          <Link
            href="/forum/new"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            New Post
          </Link>
        </div>

        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">No forum posts yet.</p>
              <Link
                href="/forum/new"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Start a Discussion
              </Link>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start space-x-4">
                  {post.users.avatar_url && (
                    <img
                      src={post.users.avatar_url}
                      alt={post.users.name || 'User'}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      <Link href={`/forum/post/${post.id}`} className="hover:text-blue-600">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">{post.body}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>by {post.users.name || 'Anonymous'}</span>
                          <span>•</span>
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        {(post.assets || post.stacks) && (
                          <>
                            <span>•</span>
                            <span className="text-sm text-gray-500">
                              Related to: {' '}
                              {post.assets ? (
                                <Link href={`/asset/${post.assets.id}`} className="text-blue-600 hover:text-blue-800">
                                  {post.assets.title}
                                </Link>
                              ) : (
                                <Link href={`/stack/${post.stacks!.id}`} className="text-blue-600 hover:text-blue-800">
                                  {post.stacks!.name}
                                </Link>
                              )}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 