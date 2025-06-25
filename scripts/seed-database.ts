import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const sampleUsers = [
  {
    id: 'demo-user-1',
    email: 'demo@usefully.com',
    name: 'Demo User',
    bio: 'Building useful tools and sharing knowledge',
    useful_score: 5
  },
  {
    id: 'demo-user-2', 
    email: 'designer@usefully.com',
    name: 'Design Pro',
    bio: 'UI/UX designer passionate about great user experiences',
    useful_score: 8
  },
  {
    id: 'demo-user-3',
    email: 'backend@usefully.com', 
    name: 'Backend Dev',
    bio: 'Full-stack developer focused on scalable solutions',
    useful_score: 15
  }
]

const sampleAssets = [
  {
    id: 'asset-1',
    owner_id: 'demo-user-1',
    url: 'https://github.com/vercel/next.js',
    title: 'Next.js - The React Framework',
    why_useful: 'Essential framework for building modern React applications with server-side rendering and static generation.',
    tag: 'Development',
    image_url: 'https://nextjs.org/static/twitter-image.png'
  },
  {
    id: 'asset-2',
    owner_id: 'demo-user-2',
    url: 'https://tailwindcss.com',
    title: 'Tailwind CSS - Utility-First CSS Framework',
    why_useful: 'Rapidly build modern websites without ever leaving your HTML. Highly customizable and responsive.',
    tag: 'Design',
    image_url: 'https://tailwindcss.com/_next/static/media/tailwindcss-mark.3c5441fc7a190fb1800d4a5c7f07ba4b1345a9c8.svg'
  },
  {
    id: 'asset-3',
    owner_id: 'demo-user-3',
    url: 'https://supabase.com',
    title: 'Supabase - Open Source Firebase Alternative',
    why_useful: 'Complete backend solution with database, auth, and real-time subscriptions. Perfect for rapid development.',
    tag: 'Backend',
    image_url: 'https://supabase.com/images/brand-assets/supabase-logo-wordmark--dark.svg'
  },
  {
    id: 'asset-4',
    owner_id: 'demo-user-1',
    url: 'https://typescriptlang.org',
    title: 'TypeScript - JavaScript with syntax for types',
    why_useful: 'Adds static typing to JavaScript, making code more reliable and easier to maintain.',
    tag: 'Development',
    image_url: 'https://www.typescriptlang.org/images/branding/logo.svg'
  },
  {
    id: 'asset-5',
    owner_id: 'demo-user-2',
    url: 'https://figma.com',
    title: 'Figma - Collaborative interface design tool',
    why_useful: 'Real-time collaborative design tool that makes it easy to create, share, and iterate on designs.',
    tag: 'Design',
    image_url: 'https://cdn.sanity.io/images/599r6htc/localized/46a76c802176eb17b04e12108de7e7e0f3736dc6-1024x1024.png'
  }
]

const sampleVotes = [
  { user_id: 'demo-user-1', asset_id: 'asset-2' },
  { user_id: 'demo-user-1', asset_id: 'asset-3' },
  { user_id: 'demo-user-2', asset_id: 'asset-1' },
  { user_id: 'demo-user-2', asset_id: 'asset-3' },
  { user_id: 'demo-user-3', asset_id: 'asset-1' },
  { user_id: 'demo-user-3', asset_id: 'asset-2' },
  { user_id: 'demo-user-3', asset_id: 'asset-4' },
  { user_id: 'demo-user-1', asset_id: 'asset-5' },
  { user_id: 'demo-user-2', asset_id: 'asset-4' }
]

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  try {
    // Insert users
    console.log('📝 Inserting users...')
    for (const user of sampleUsers) {
      const { error } = await supabase
        .from('users')
        .upsert(user, { onConflict: 'id' })
      
      if (error) {
        console.error('Error inserting user:', error)
      } else {
        console.log(`✅ Inserted user: ${user.name}`)
      }
    }

    // Insert assets
    console.log('📝 Inserting assets...')
    for (const asset of sampleAssets) {
      const { error } = await supabase
        .from('assets')
        .upsert(asset, { onConflict: 'id' })
      
      if (error) {
        console.error('Error inserting asset:', error)
      } else {
        console.log(`✅ Inserted asset: ${asset.title}`)
      }
    }

    // Insert useful votes
    console.log('📝 Inserting useful votes...')
    for (const vote of sampleVotes) {
      const { error } = await supabase
        .from('useful_votes')
        .upsert(vote, { onConflict: 'user_id,asset_id' })
      
      if (error) {
        console.error('Error inserting vote:', error)
      } else {
        console.log(`✅ Inserted vote for asset: ${vote.asset_id}`)
      }
    }

    console.log('🎉 Database seeding completed successfully!')
    console.log(`📊 Seeded ${sampleUsers.length} users, ${sampleAssets.length} assets, and ${sampleVotes.length} votes`)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase() 