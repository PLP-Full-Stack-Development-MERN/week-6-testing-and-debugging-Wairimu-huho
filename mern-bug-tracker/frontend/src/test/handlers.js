import { rest } from 'msw'

// Sample data for testing
export const mockBugs = [
  {
    _id: '1',
    title: 'Login button not working',
    description: 'The login button on the homepage does not respond when clicked.',
    status: 'open',
    priority: 'high',
    reportedBy: 'John Doe',
    project: 'Website',
    createdAt: '2023-01-15T08:30:00.000Z',
    updatedAt: '2023-01-15T08:30:00.000Z',
    stepsToReproduce: '1. Go to homepage\n2. Click login button',
    assignedTo: 'Unassigned'
  },
  {
    _id: '2',
    title: 'Incorrect total in shopping cart',
    description: 'The total amount in the shopping cart does not match the sum of the items.',
    status: 'in-progress',
    priority: 'medium',
    reportedBy: 'Jane Smith',
    project: 'E-commerce',
    createdAt: '2023-01-10T14:20:00.000Z',
    updatedAt: '2023-01-16T09:15:00.000Z',
    stepsToReproduce: '1. Add multiple items to cart\n2. View cart',
    assignedTo: 'Mike Johnson'
  },
  {
    _id: '3',
    title: 'Cannot upload profile picture',
    description: 'When trying to upload a profile picture, the upload button does nothing.',
    status: 'resolved',
    priority: 'low',
    reportedBy: 'Alice Williams',
    project: 'User Portal',
    createdAt: '2023-01-05T11:45:00.000Z',
    updatedAt: '2023-01-17T13:50:00.000Z',
    stepsToReproduce: '1. Go to profile\n2. Click upload picture\n3. Select file',
    assignedTo: 'Tom Brown'
  }
]

// Mock API handlers
export const handlers = [
  // Get all bugs
  rest.get('http://localhost:5000/api/bugs', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        count: mockBugs.length,
        total: mockBugs.length,
        totalPages: 1,
        currentPage: 1,
        data: mockBugs
      })
    )
  }),

  // Get bug by ID
  rest.get('http://localhost:5000/api/bugs/:id', (req, res, ctx) => {
    const { id } = req.params
    const bug = mockBugs.find(bug => bug._id === id)
    
    if (!bug) {
      return res(
        ctx.status(404),
        ctx.json({
          success: false,
          message: `Bug not found with id ${id}`
        })
      )
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: bug
      })
    )
  }),

  // Create a bug
  rest.post('http://localhost:5000/api/bugs', async (req, res, ctx) => {
    const bugData = await req.json()
    
    // Simulate validation error
    if (!bugData.title) {
      return res(
        ctx.status(400),
        ctx.json({
          success: false,
          errors: [
            {
              field: 'title',
              message: 'Bug title is required'
            }
          ]
        })
      )
    }
    
    const newBug = {
      _id: Math.random().toString(36).substr(2, 9),
      ...bugData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        data: newBug
      })
    )
  }),

  // Update a bug
  rest.put('http://localhost:5000/api/bugs/:id', async (req, res, ctx) => {
    const { id } = req.params
    const bugData = await req.json()
    
    const bugIndex = mockBugs.findIndex(bug => bug._id === id)
    
    if (bugIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({
          success: false,
          message: `Bug not found with id ${id}`
        })
      )
    }
    
    // Simulate invalid status transition
    if (
      bugData.status === 'in-progress' && 
      mockBugs[bugIndex].status === 'closed'
    ) {
      return res(
        ctx.status(400),
        ctx.json({
          success: false,
          message: `Invalid status transition from 'closed' to 'in-progress'`
        })
      )
    }
    
    const updatedBug = {
      ...mockBugs[bugIndex],
      ...bugData,
      updatedAt: new Date().toISOString()
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: updatedBug
      })
    )
  }),

  // Delete a bug
  rest.delete('http://localhost:5000/api/bugs/:id', (req, res, ctx) => {
    const { id } = req.params
    
    const bugIndex = mockBugs.findIndex(bug => bug._id === id)
    
    if (bugIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({
          success: false,
          message: `Bug not found with id ${id}`
        })
      )
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {},
        message: 'Bug successfully deleted'
      })
    )
  }),

  // Get bug statistics
  rest.get('http://localhost:5000/api/bugs/stats', (req, res, ctx) => {
    // Calculate mock statistics based on mockBugs
    const statusStats = [
      { _id: 'open', count: mockBugs.filter(bug => bug.status === 'open').length },
      { _id: 'in-progress', count: mockBugs.filter(bug => bug.status === 'in-progress').length },
      { _id: 'resolved', count: mockBugs.filter(bug => bug.status === 'resolved').length },
      { _id: 'closed', count: mockBugs.filter(bug => bug.status === 'closed').length }
    ]
    
    const priorityStats = [
      { _id: 'low', count: mockBugs.filter(bug => bug.priority === 'low').length },
      { _id: 'medium', count: mockBugs.filter(bug => bug.priority === 'medium').length },
      { _id: 'high', count: mockBugs.filter(bug => bug.priority === 'high').length },
      { _id: 'critical', count: mockBugs.filter(bug => bug.priority === 'critical').length }
    ]
    
    // Group by project and count
    const projectCounts = {}
    mockBugs.forEach(bug => {
      if (!projectCounts[bug.project]) {
        projectCounts[bug.project] = 0
      }
      projectCounts[bug.project]++
    })
    
    const projectStats = Object.entries(projectCounts).map(([project, count]) => ({
      _id: project,
      count
    }))
    
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          status: statusStats,
          priority: priorityStats,
          projects: projectStats
        }
      })
    )
  })
]