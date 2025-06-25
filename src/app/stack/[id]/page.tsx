'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Database } from '@/types/database'
import Link from 'next/link'

type Stack = Database['public']['Tables']['stacks']['Row'] & {
  users: Database['public']['Tables']['users']['Row']
  stack_items: {
    assets: Database['public']['Tables']['assets']['Row'] & {
      users: Database['public']['Tables']['users']['Row']
      useful_count: number
    }
  }[]
}

export default function StackPage({ params }: { params: { id: string } }) {
  const [stack, setStack] = useState<Stack | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    fetchStack()
  }, [params.id])

  const fetchStack = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('stacks')
      .select(`
        *,
        users (id, name, avatar_url),
        stack_items (
          assets (
            *,
            users (id, name, avatar_url),
            useful_votes (user_id)
          )
        )
      `)
      .eq('id', params.id)
      .single()

    if (data) {
      const stackWithCounts = {
        ...data,
        stack_items: data.stack_items.map((item: any) => ({
          ...item,
          assets: {
            ...item.assets,
            useful_count: item.assets.useful_votes?.length || 0
          }
        }))
      }
      setStack(stackWithCounts)
      setIsOwner(user ? user.id === data.owner_id : false)
    }
    setLoading(false)
  }

  const handleRemoveAsset = async (assetId: string) => {
    const supabase = createClient()
    await supabase
      .from('stack_items')
      .delete()
      .eq('stack_id', params.id)
      .eq('asset_id', assetId)

    fetchStack()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!stack) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Stack not found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
          ← Back to feed
        </Link>

        {/* Stack Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{stack.name}</h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>by {stack.users.name || 'Anonymous'}</span>
                <span>•</span>
                <span>{new Date(stack.created_at).toLocaleDateString()}</span>
                <span>•</span>
                <span>{stack.stack_items.length} assets</span>
                {!stack.is_public && (
                  <>
                    <span>•</span>
                    <span className="text-orange-600">Private</span>
                  </>
                )}
              </div>
            </div>
            {isOwner && (
              <Link
                href={`/stack/${params.id}/edit`}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Edit Stack
              </Link>
            )}
          </div>
        </div>

        {/* Assets Grid */}
        <div className="space-y-6">
          {stack.stack_items.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">This stack is empty</p>
              {isOwner && (
                <Link
                  href="/submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add Assets
                </Link>
              )}
            </div>
          ) : (
            stack.stack_items.map((item) => (
              <div key={item.assets.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start space-x-4">
                  {item.assets.image_url && (
                    <img
                      src={item.assets.image_url}
                      alt={item.assets.title}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      <Link href={`/asset/${item.assets.id}`} className="hover:text-blue-600">
                        {item.assets.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-3">{item.assets.why_useful}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.assets.tag}
                        </span>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>by {item.assets.users.name || 'Anonymous'}</span>
                          <span>•</span>
                          <span>{new Date(item.assets.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                          <span>👍</span>
                          <span>{item.assets.useful_count}</span>
                        </span>
                        {isOwner && (
                          <button
                            onClick={() => handleRemoveAsset(item.assets.id)}
                            className="px-3 py-1 text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
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