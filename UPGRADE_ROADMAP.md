# Arise Production Studio - Upgrade Roadmap

**Date**: 2026-09-18
**Based On**: No Slop Audit Report
**Priority**: High - Transform from tool shell to functional production studio

---

## Executive Summary

The audit revealed that while all components were created, only 27% are actually integrated. This roadmap transforms Arise Production from a tool detection shell into a functional 4K 3D film production studio by integrating dead code, wiring up non-functional features, and completing the production workflow.

---

## Phase 1: Component Integration (Priority: CRITICAL)

### 1.1 Integrate Timeline Component
**Status**: File exists but not integrated
**Action**: Add Timeline to appropriate views
**Estimated Effort**: 2 hours

**Steps**:
1. Import Timeline in ShellLayout.tsx
2. Add Timeline to stage view (below 3D canvas)
3. Add Timeline to screening room view
4. Wire up time/shot state from projectStatus
5. Test timeline playhead and markers
6. Verify timeline navigation

**Files to Modify**:
- `frontend/src/components/ShellLayout.tsx`
- `frontend/src/components/StageWorkspace.tsx`
- `frontend/src/components/VideoScreeningRoom.tsx`

### 1.2 Integrate MediaBin Component
**Status**: File exists but not integrated
**Action**: Add MediaBin to appropriate views
**Estimated Effort**: 2 hours

**Steps**:
1. Import MediaBin in ShellLayout.tsx
2. Add MediaBin to stage view (left sidebar or tab)
3. Add MediaBin to screening room view
4. Create sample asset data structure
5. Wire up asset upload/download
6. Test drag-and-drop to timeline

**Files to Modify**:
- `frontend/src/components/ShellLayout.tsx`
- `frontend/src/components/StageWorkspace.tsx`
- `frontend/src/components/VideoScreeningRoom.tsx`

### 1.3 Integrate InspectorPanel Component
**Status**: File exists but not integrated
**Action**: Add InspectorPanel to appropriate views
**Estimated Effort**: 2 hours

**Steps**:
1. Import InspectorPanel in ShellLayout.tsx
2. Add InspectorPanel to stage view (right sidebar or tab)
3. Add InspectorPanel to 3D architecture view
4. Wire up selected object state from 3D scene
5. Create sample property data structure
6. Test property editing and 3D updates

**Files to Modify**:
- `frontend/src/components/ShellLayout.tsx`
- `frontend/src/components/StageWorkspace.tsx`
- `frontend/src/components/StudioArchitecturalView.tsx`

### 1.4 Integrate DualMonitorSupport Component
**Status**: File exists but not integrated
**Action**: Add dual monitor controls to settings
**Estimated Effort**: 1 hour

**Steps**:
1. Import DualMonitorSupport in ShellLayout.tsx
2. Add to settings modal or dedicated view
3. Wire up display detection logic
4. Test window movement between displays

**Files to Modify**:
- `frontend/src/components/ShellLayout.tsx`

### 1.5 Integrate CustomLayout Component
**Status**: File exists but not integrated
**Action**: Add custom layout controls to settings
**Estimated Effort**: 1 hour

**Steps**:
1. Import CustomLayout in ShellLayout.tsx
2. Add to settings modal or dedicated view
3. Wire up panel arrangement state
4. Test panel drag-and-drop
5. Implement layout save/load

**Files to Modify**:
- `frontend/src/components/ShellLayout.tsx`

---

## Phase 2: Non-Functional Features (Priority: HIGH)

### 2.1 Wire Up Keyboard Shortcuts
**Status**: UI exists but shortcuts don't work
**Action**: Actually wire up keyboard event handling
**Estimated Effort**: 2 hours

**Steps**:
1. Import useKeyboardShortcuts hook in ShellLayout.tsx
2. Import productionShortcuts array
3. Call useKeyboardShortcuts(productionShortcuts) in ShellLayout
4. Add input detection to prevent shortcuts in text fields
5. Test all 17 shortcuts
6. Verify shortcuts don't interfere with text input

**Files to Modify**:
- `frontend/src/components/ShellLayout.tsx`

### 2.2 Create Theme Switching UI
**Status**: Theme presets exist but no UI to switch
**Action**: Add theme selector to settings
**Estimated Effort**: 1 hour

**Steps**:
1. Create ThemeSelector component
2. Add to settings modal or dedicated view
3. Wire up theme selection
4. Persist theme choice to localStorage
5. Test theme switching and persistence

**Files to Create**:
- `frontend/src/components/ThemeSelector.tsx`

**Files to Modify**:
- `frontend/src/components/ShellLayout.tsx`

### 2.3 Remove or Use Dead Code
**Status**: 11 components are dead code
**Action**: Either integrate or remove to reduce technical debt
**Estimated Effort**: 2 hours

**Steps**:
1. Decide which components to keep (likely: LazyLoad, Design Tokens, Base Components)
2. Integrate useful components
3. Remove truly unused components
4. Update verification scripts
5. Document decision

**Files to Modify**:
- `frontend/src/components/LazyLoad.tsx` (integrate or remove)
- `frontend/src/design-tokens.ts` (integrate or remove)
- `frontend/src/components/ui/base-components.tsx` (integrate or remove)

---

## Phase 3: MCP Configuration (Priority: HIGH)

### 3.1 Configure Wasserman MCPs
**Status**: Guide written but no actual configuration
**Action**: Add Wasserman MCPs to .mcp.json
**Estimated Effort**: 3 hours

**Steps**:
1. Launch each Wasserman app individually
2. Check each app's MCP documentation
3. Determine MCP server command/args for each
4. Add to .mcp.json
5. Test MCP connections
6. Document configuration

**Files to Modify**:
- `.mcp.json`

**Wasserman Apps to Configure**:
- ScriptBreak.app
- Cork Board.app
- Master Canvas.app
- Blockout.app
- Storyboard Reference Studio.app
- Circle Take.app
- Stem Studio.app
- Slate.app (if installed)
- Motion Previs Studio.app (if installed)

### 3.2 Start MCP Servers
**Status**: 3 of 4 configured MCPs not running
**Action**: Start and verify MCP servers
**Estimated Effort**: 2 hours

**Steps**:
1. Start OpenMontage MCP server
2. Start Unreal Engine MCP connector
3. Start Hyperframes MCP connector
4. Verify each server responds to health checks
5. Test MCP tool availability
6. Document startup procedures

**Note**: This requires user to actually start these servers. Cannot be automated without their manual intervention.

---

## Phase 4: Production Workflow (Priority: CRITICAL)

### 4.1 Create State Management
**Status**: No centralized state for production data
**Action**: Implement state management for timeline, media, properties
**Estimated Effort**: 4 hours

**Steps**:
1. Choose state management solution (Zustand, Redux, or React Context)
2. Create production context/store
3. Define state shape (timeline clips, media assets, properties)
4. Implement actions (add clip, add asset, update property)
5. Wire up components to state
6. Test state updates across components

**Files to Create**:
- `frontend/src/store/productionContext.tsx` (or equivalent)

**Files to Modify**:
- `frontend/src/components/Timeline.tsx`
- `frontend/src/components/MediaBin.tsx`
- `frontend/src/components/InspectorPanel.tsx`

### 4.2 Connect Timeline + MediaBin + Inspector
**Status**: Components exist but don't work together
**Action**: Create actual production workflow
**Estimated Effort**: 3 hours

**Steps**:
1. Wire up MediaBin → Timeline (drag clips)
2. Wire up Timeline → Inspector (select clips)
3. Wire up Inspector → 3D (update properties)
4. Create circular data flow
5. Test complete workflow
6. Add undo/redo functionality

**Files to Modify**:
- `frontend/src/components/Timeline.tsx`
- `frontend/src/components/MediaBin.tsx`
- `frontend/src/components/InspectorPanel.tsx`

---

## Phase 5: Sidebar Navigation Debug (Priority: MEDIUM)

### 5.1 Debug Sidebar Navigation
**Status**: User reports sidebar not working (code looks correct)
**Action**: Investigate and fix runtime issue
**Estimated Effort**: 2 hours

**Steps**:
1. Check browser console for JavaScript errors
2. Inspect event listeners on navigation buttons
3. Check CSS z-index for overlapping elements
4. Verify React state updates
5. Test in different browsers
6. Add debug logging if needed

**Files to Modify**:
- `frontend/src/components/ShellLayout.tsx` (debugging only)

---

## Phase 6: Performance Optimization (Priority: LOW)

### 6.1 Implement Actual Lazy Loading
**Status**: LazyLoad component exists but not used
**Action**: Actually lazy load heavy components
**Estimated Effort**: 2 hours

**Steps**:
1. Wrap heavy 3D components in LazyLoadWrapper
2. Replace direct imports with React.lazy()
3. Add Suspense boundaries
4. Test loading states
5. Measure performance improvement

**Files to Modify**:
- `frontend/src/components/ShellLayout.tsx`
- `frontend/src/components/StageWorkspace.tsx`

### 6.2 Use Design Tokens
**Status**: Design tokens exist but not used
**Action**: Replace hardcoded values with tokens
**Estimated Effort**: 2 hours

**Steps**:
1. Import design tokens
2. Replace hardcoded spacing in components
3. Replace hardcoded colors in components
4. Replace hardcoded shadows in components
5. Test visual consistency

**Files to Modify**:
- All component files (systematic replacement)

---

## Phase 7: Testing & Verification (Priority: HIGH)

### 7.1 Create E2E Tests
**Status**: No E2E tests exist
**Action**: Create automated tests for key workflows
**Estimated Effort**: 4 hours

**Steps**:
1. Set up Playwright or Cypress
2. Write test for navigation
3. Write test for tool detection
4. Write test for timeline interaction
5. Write test for media bin operations
6. Run tests and fix failures

**Files to Create**:
- `frontend/e2e/navigation.spec.ts`
- `frontend/e2e/tools.spec.ts`
- `frontend/e2e/production.spec.ts`

### 7.2 Update Verification Scripts
**Status**: Verification only checks file existence
**Action**: Add integration and functionality checks
**Estimated Effort**: 2 hours

**Steps**:
1. Add checks for component integration
2. Add checks for functionality (shortcuts working)
3. Add checks for MCP server runtime status
4. Add checks for production workflow
5. Update test counts

**Files to Modify**:
- `backend/verify-ui-ux.js`
- `backend/verify-phase2-5.js`

---

## Phase 8: Documentation (Priority: MEDIUM)

### 8.1 Update README
**Status**: README created but needs roadmap integration
**Action**: Integrate this roadmap into README
**Estimated Effort**: 0.5 hours

**Steps**:
1. Link to this roadmap from README
2. Update current status based on completed phases
3. Add known issues section
4. Add troubleshooting section

**Files to Modify**:
- `README.md`

### 8.2 Create Component Documentation
**Status**: Components lack documentation
**Action**: Add JSDoc comments and usage examples
**Estimated Effort**: 3 hours

**Steps**:
1. Add JSDoc to all components
2. Add usage examples in comments
3. Create component documentation pages
4. Add prop types documentation

**Files to Modify**:
- All component files

---

## Priority Order

1. **Phase 1** (Component Integration) - CRITICAL
2. **Phase 4** (Production Workflow) - CRITICAL
3. **Phase 2** (Non-Functional Features) - HIGH
4. **Phase 3** (MCP Configuration) - HIGH
5. **Phase 7** (Testing & Verification) - HIGH
6. **Phase 5** (Sidebar Debug) - MEDIUM
7. **Phase 6** (Performance) - LOW
8. **Phase 8** (Documentation) - MEDIUM

---

## Total Estimated Effort

- **Phase 1**: 8 hours
- **Phase 2**: 5 hours
- **Phase 3**: 5 hours
- **Phase 4**: 7 hours
- **Phase 5**: 2 hours
- **Phase 6**: 4 hours
- **Phase 7**: 6 hours
- **Phase 8**: 3.5 hours

**Total**: 40.5 hours

---

## Success Criteria

At completion, Arise Production will be:

- ✅ Functional 4K 3D film production studio
- ✅ All components integrated and working
- ✅ Keyboard shortcuts functional
- ✅ Theme switching available
- ✅ All MCPs configured and running
- ✅ Complete production workflow (timeline + media + inspector)
- ✅ State management implemented
- ✅ E2E tests passing
- ✅ Comprehensive documentation

---

## Next Steps

1. Review this roadmap
2. Approve or modify priority order
3. Begin Phase 1 (Component Integration)
4. Proceed through phases sequentially
5. Verify each phase with updated verification scripts
6. Update README as progress is made

---

**Last Updated**: 2026-09-18
