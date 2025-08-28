/**
 * Utility function to update project statuses from draft to active
 * This can be used to fix existing projects that are stuck in draft status
 */

import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'

export async function updateDraftProjectsToActive(clientId: string) {
  try {
    console.log('🔄 Starting to update draft projects to active for client:', clientId)
    
    // Query for all draft projects by this client
    const q = query(
      collection(db, 'projects'),
      where('clientId', '==', clientId),
      where('status', '==', 'draft')
    )
    
    const querySnapshot = await getDocs(q)
    console.log('📊 Found', querySnapshot.size, 'draft projects to update')
    
    const updatePromises = querySnapshot.docs.map(async (docSnapshot) => {
      const projectId = docSnapshot.id
      const projectData = docSnapshot.data()
      
      console.log('🔄 Updating project:', projectData.title, '- ID:', projectId)
      
      await updateDoc(doc(db, 'projects', projectId), {
        status: 'active',
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      
      console.log('✅ Updated project:', projectData.title)
    })
    
    await Promise.all(updatePromises)
    
    console.log('🎉 Successfully updated', querySnapshot.size, 'projects from draft to active')
    return { success: true, updatedCount: querySnapshot.size }
    
  } catch (error) {
    console.error('❌ Error updating draft projects:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
