'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Database } from '@/types/database'
import Link from 'next/link'

type Asset = Database['public']['Tables']['assets']['Row'] & {
  users: Database['public']['Tables']['users']['Row']
  useful_count: number
  is_useful: boolean
}

type Review = Database['public']['Tables']['reviews']['Row'] & {
  users: Database['public']['Tables']['users']['Row']
}

export default function ({ params }: { params: { id: string } }) {
  const [asset, setAsset] = useState<Asset | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [newReview, setNewReview] = useState('')

  useEffect(() => {
    fetchAsset()
    fetchReviews()
  }, [params.id])

  const fetchAsset = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('assets')
      .select(`
        *,
        users (id, name, avatar_url),
        useful_votes (user_id)
      `)
      .eq('id', params.id)
      .single()

    if (data) {
      const assetWithCounts = {
        ...data,
        useful_count: data.useful_votes?.length || 0,
        is_useful: user ? data.useful_votes?.some((vote: any) => vote.user_id === user.id) : false
      }
      setAsset(assetWithCounts)
    }
    setLoading(false)
  }

  const fetchReviews = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        users (id, name, avatar_url)
      `)
      .eq('asset_id', params.id)
      .order('created_at', { ascending: false })

    if (data) {
      setReviews(data)
    }
  }

  const handleUseful = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      // Show auth modal
      return
    }

    if (asset?.is_useful) {
      await supabase
        .from('useful_votes')
        .delete()
        .eq('user_id', user.id)
        .eq('asset_id', params.id)
    } else {
      await supabase
        .from('useful_votes')
        .insert({ user_id: user.id, asset_id: params.id })
    }

    fetchAsset()
  }

  const handleSubmitReview = async () => {
    if (!newReview.trim()) return

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      // Show auth modal
      return
    }

    await supabase
      .from('reviews')
      .insert({
        asset_id: params.id,
        user_id: user.id,
        body: newReview
      })

    setNewReview('')
    fetchReviews()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Asset not found</h1>
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

        {/* Asset Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start space-x-6">
            {asset.image_url && (
              <img
                src={asset.image_url}
                alt={asset.title}
                className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                <a href={asset.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                  {asset.title}
                </a>
              </h1>
              <p className="text-lg text-gray-600 mb-4">{asset.why_useful}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {asset.tag}
                  </span>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>by {asset.users.name || 'Anonymous'}</span>
                    <span>•</span>
                    <span>{new Date(asset.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={handleUseful}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    asset.is_useful
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>👍</span>
                  <span>{asset.useful_count}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
          
          {/* Add Review */}
          <div className="mb-8">
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Share your thoughts about this asset..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            <button
              onClick={handleSubmitReview}
              disabled={!newReview.trim()}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Review
            </button>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border-t border-gray-200 pt-6">
                  <div className="flex items-start space-x-3">
                    {review.users.avatar_url && (
                      <img
                        src={review.users.avatar_url}
                        alt={review.users.name || 'User'}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">
                          {review.users.name || 'Anonymous'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.body}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 