'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Database } from '@/types/database'
import Link from 'next/link'

type User = Database['public']['Tables']['users']['Row']
type Asset = Database['public']['Tables']['assets']['Row'] & {
  useful_count: number
}
type Stack = Database['public']['Tables']['stacks']['Row']
type Badge = Database['public']['Tables']['badges']['Row']

export default function UserPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [stacks, setStacks] = useState<Stack[]>([])
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'assets' | 'stacks'>('assets')
  const [isFollowing, setIsFollowing] = useState(false)
  const [isOwnProfile, setIsOwnProfile] = useState(false)

  useEffect(() => {
    fetchUserData()
  }, [params.id])

  const fetchUserData = async () => {
    const supabase = createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    
    // Fetch user profile
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', params.id)
      .single()

    if (userData) {
      setUser(userData)
      setIsOwnProfile(currentUser ? currentUser.id === params.id : false)
    }

    // Fetch user's assets
    const { data: assetsData } = await supabase
      .from('assets')
      .select(`
        *,
        useful_votes (user_id)
      `)
      .eq('owner_id', params.id)
      .order('created_at', { ascending: false })

    if (assetsData) {
      const assetsWithCounts = assetsData.map(asset => ({
        ...asset,
        useful_count: asset.useful_votes?.length || 0
      }))
      setAssets(assetsWithCounts)
    }

    // Fetch user's stacks
    const { data: stacksData } = await supabase
      .from('stacks')
      .select('*')
      .eq('owner_id', params.id)
      .order('created_at', { ascending: false })

    if (stacksData) {
      setStacks(stacksData)
    }

    // Fetch user's badges
    const { data: badgesData } = await supabase
      .from('badges')
      .select('*')
      .eq('user_id', params.id)

    if (badgesData) {
      setBadges(badgesData)
    }

    // Check if current user is following this user
    if (currentUser && currentUser.id !== params.id) {
      const { data: followData } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', currentUser.id)
        .eq('following_id', params.id)
        .single()

      setIsFollowing(!!followData)
    }

    setLoading(false)
  }

  const handleFollow = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      // Show auth modal
      return
    }

    if (isFollowing) {
      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', params.id)
    } else {
      await supabase
        .from('follows')
        .insert({
          follower_id: user.id,
          following_id: params.id
        })
    }

    setIsFollowing(!isFollowing)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User not found</h1>
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

        {/* User Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start space-x-6">
            {user.avatar_url && (
              <img
                src={user.avatar_url}
                alt={user.name || 'User'}
                className="w-24 h-24 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{user.name || 'Anonymous'}</h1>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                {!isOwnProfile && (
                  <button
                    onClick={handleFollow}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      isFollowing
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
              
              {user.bio && (
                <p className="text-gray-700 mb-4">{user.bio}</p>
              )}

              {/* Stats */}
              <div className="flex items-center space-x-8 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{assets.length}</div>
                  <div className="text-gray-500">Assets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{user.useful_score}</div>
                  <div className="text-gray-500">Useful Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stacks.length}</div>
                  <div className="text-gray-500">Stacks</div>
                </div>
              </div>

              {/* Badges */}
              {badges.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Badges</h3>
                  <div className="flex space-x-2">
                    {badges.map((badge) => (
                      <span
                        key={badge.type}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                      >
                        {badge.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-8 shadow-sm">
          <button
            onClick={() => setActiveTab('assets')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'assets'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Assets ({assets.length})
          </button>
          <button
            onClick={() => setActiveTab('stacks')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'stacks'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Stacks ({stacks.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'assets' ? (
          <div className="space-y-6">
            {assets.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <p className="text-gray-500">No assets yet.</p>
              </div>
            ) : (
              assets.map((asset) => (
                <div key={asset.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start space-x-4">
                    {asset.image_url && (
                      <img
                        src={asset.image_url}
                        alt={asset.title}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        <Link href={`/asset/${asset.id}`} className="hover:text-blue-600">
                          {asset.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 mb-3">{asset.why_useful}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {asset.tag}
                          </span>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{new Date(asset.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                          <span>👍</span>
                          <span>{asset.useful_count}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {stacks.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <p className="text-gray-500">No stacks yet.</p>
              </div>
            ) : (
              stacks.map((stack) => (
                <div key={stack.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        <Link href={`/stack/${stack.id}`} className="hover:text-blue-600">
                          {stack.name}
                        </Link>
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{new Date(stack.created_at).toLocaleDateString()}</span>
                        {!stack.is_public && (
                          <>
                            <span>•</span>
                            <span className="text-orange-600">Private</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
} 