'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase'
import { Database } from '@/types/database'
import { useAuth } from '@/contexts/AuthContext'
import { useSearchParams } from 'next/navigation'

type Asset = Database['public']['Tables']['assets']['Row'] & {
  users: Database['public']['Tables']['users']['Row']
  useful_count: number
  is_useful: boolean
}

// Sample data for demonstration
const sampleAssets: Asset[] = [
  {
    id: '1',
    owner_id: 'demo-user',
    url: 'https://github.com/vercel/next.js',
    title: 'Next.js - The React Framework',
    why_useful: 'Essential framework for building modern React applications with server-side rendering and static generation.',
    tag: 'Development',
    image_url: 'https://nextjs.org/static/twitter-image.png',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    users: {
      id: 'demo-user',
      email: 'demo@usefully.com',
      name: 'Demo User',
      avatar_url: null,
      bio: null,
      useful_score: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    useful_count: 12,
    is_useful: false
  },
  {
    id: '2',
    owner_id: 'demo-user-2',
    url: 'https://tailwindcss.com',
    title: 'Tailwind CSS - Utility-First CSS Framework',
    why_useful: 'Rapidly build modern websites without ever leaving your HTML. Highly customizable and responsive.',
    tag: 'Design',
    image_url: 'https://tailwindcss.com/_next/static/media/tailwindcss-mark.3c5441fc7a190fb1800d4a5c7f07ba4b1345a9c8.svg',
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    users: {
      id: 'demo-user-2',
      email: 'designer@usefully.com',
      name: 'Design Pro',
      avatar_url: null,
      bio: null,
      useful_score: 8,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    useful_count: 8,
    is_useful: false
  },
  {
    id: '3',
    owner_id: 'demo-user-3',
    url: 'https://supabase.com',
    title: 'Supabase - Open Source Firebase Alternative',
    why_useful: 'Complete backend solution with database, auth, and real-time subscriptions. Perfect for rapid development.',
    tag: 'Backend',
    image_url: 'https://supabase.com/images/brand-assets/supabase-logo-wordmark--dark.svg',
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    users: {
      id: 'demo-user-3',
      email: 'backend@usefully.com',
      name: 'Backend Dev',
      avatar_url: null,
      bio: null,
      useful_score: 15,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    useful_count: 23,
    is_useful: false
  }
]

function HomePageContent() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<'24h' | 'week' | 'all'>('24h')
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const [usingSampleData, setUsingSampleData] = useState(false)

  // Handle auth errors from URL params
  useEffect(() => {
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    
    if (error === 'access_denied' && errorDescription) {
      setAuthError(decodeURIComponent(errorDescription))
    }
  }, [searchParams])

  const fetchAssets = async (period: '24h' | 'week' | 'all') => {
    setLoading(true)
    
    const supabase = createClient()
    
    let query = supabase
      .from('assets')
      .select(`
        *,
        users (id, name, avatar_url),
        useful_votes (user_id)
      `)
      .order('created_at', { ascending: false })

    if (period === '24h') {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      query = query.gte('created_at', yesterday.toISOString())
    } else if (period === 'week') {
      const lastWeek = new Date()
      lastWeek.setDate(lastWeek.getDate() - 7)
      query = query.gte('created_at', lastWeek.toISOString())
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
    } else if (data && data.length > 0) {
      const assetsWithCounts = data.map(asset => ({
        ...asset,
        useful_count: asset.useful_votes?.length || 0,
        is_useful: user ? asset.useful_votes?.some(vote => vote.user_id === user.id) : false
      }))
      setAssets(assetsWithCounts)
      setUsingSampleData(false)
    } else {
      // Use sample data if no real data exists
      const filteredSampleData = sampleAssets.filter(asset => {
        const assetDate = new Date(asset.created_at)
        const now = new Date()
        
        if (period === '24h') {
          const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
          return assetDate >= yesterday
        } else if (period === 'week') {
          const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return assetDate >= lastWeek
        }
        return true // 'all' period
      })
      
      setAssets(filteredSampleData)
      setUsingSampleData(true)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAssets(activeTab)
  }, [activeTab, user])

  const handleTabChange = (tab: '24h' | 'week' | 'all') => {
    setActiveTab(tab)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Usefully</h1>
        
        {/* Auth Error Banner */}
        {authError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Authentication Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{authError}</p>
                  <p className="mt-1">Please try signing in again.</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => setAuthError(null)}
                    className="bg-red-100 text-red-800 px-3 py-2 rounded-md text-sm hover:bg-red-200"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sample Data Notice */}
        {usingSampleData && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Demo Mode
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Showing sample data. Sign in and submit your own useful resources!</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Feed Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-8 shadow-sm">
          <button
            onClick={() => handleTabChange('24h')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === '24h'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            24-Hour Useful
          </button>
          <button
            onClick={() => handleTabChange('week')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'week'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Weekly Useful
          </button>
          <button
            onClick={() => handleTabChange('all')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All-Time Useful
          </button>
        </div>

        {/* Assets Feed */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : assets.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No assets found for this period.</p>
              <p className="text-sm">Be the first to submit something useful!</p>
            </div>
          ) : (
            assets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} onUpdate={() => fetchAssets(activeTab)} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function AssetCard({ asset, onUpdate }: { asset: Asset; onUpdate: () => void }) {
  const { user } = useAuth()

  const handleUseful = async () => {
    if (!user) {
      alert('Please sign in to vote')
      return
    }

    const supabase = createClient()

    if (asset.is_useful) {
      await supabase
        .from('useful_votes')
        .delete()
        .eq('user_id', user.id)
        .eq('asset_id', asset.id)
    } else {
      await supabase
        .from('useful_votes')
        .insert({ user_id: user.id, asset_id: asset.id })
    }
    
    onUpdate()
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
            <a href={asset.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
              {asset.title}
            </a>
          </h3>
          <p className="text-gray-600 mb-3">{asset.why_useful}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {asset.tag}
              </span>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>by {asset.users?.name || 'Anonymous'}</span>
                <span>•</span>
                <span>{new Date(asset.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <button
              onClick={handleUseful}
              disabled={!user}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                asset.is_useful
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span>👍</span>
              <span>{asset.useful_count}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  )
}
