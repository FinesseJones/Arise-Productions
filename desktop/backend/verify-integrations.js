// ==============================================================================
// ARISE PRODUCTION - INTEGRATION VERIFICATION SCRIPT
// A PRODUCT OF THE AI CONTENT FOUNDRY, LLC • © 2026
// ==============================================================================

import { toolDetection } from './services/tool-detection.js';
import { remotionConnector } from './services/remotion-connector.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('='.repeat(80));
console.log('ARISE PRODUCTION - INTEGRATION VERIFICATION');
console.log('='.repeat(80));
console.log('');

const results = {
  passed: [],
  failed: [],
  warnings: [],
};

// Test 1: Package dependencies
console.log('TEST 1: Verifying package dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8'));
  const dependencies = packageJson.dependencies || {};

  const requiredPackages = ['remotion', '@remotion/cli', '@remotion/renderer', '@remotion/bundler', 'ws'];
  let allPresent = true;

  for (const pkg of requiredPackages) {
    if (dependencies[pkg]) {
      console.log(`  ✅ ${pkg}: ${dependencies[pkg]}`);
      results.passed.push(`Package ${pkg} installed`);
    } else {
      console.log(`  ❌ ${pkg}: NOT FOUND`);
      results.failed.push(`Package ${pkg} missing`);
      allPresent = false;
    }
  }

  if (allPresent) {
    console.log('  ✅ All required packages installed\n');
  } else {
    console.log('  ❌ Some packages missing\n');
  }
} catch (err) {
  console.log(`  ❌ Failed to read package.json: ${err.message}\n`);
  results.failed.push(`package.json read failed: ${err.message}`);
}

// Test 2: Tool detection
console.log('TEST 2: Detecting local tools...');
const toolResults = await toolDetection.detectAllTools();

for (const [tool, result] of Object.entries(toolResults)) {
  if (result.found) {
    console.log(`  ✅ ${tool}: ${result.path} (${result.source})`);
    results.passed.push(`${tool} detected at ${result.path}`);
  } else {
    console.log(`  ⚠️  ${tool}: NOT FOUND`);
    results.warnings.push(`${tool} not detected`);
  }
}
console.log('');

// Test 3: MCP configuration
console.log('TEST 3: Verifying MCP configuration...');
try {
  const mcpConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../.mcp.json'), 'utf-8'));
  console.log('  ✅ .mcp.json exists and is valid JSON');

  for (const [serverName, serverConfig] of Object.entries(mcpConfig.mcpServers)) {
    const command = serverConfig.command;
    const args = serverConfig.args || [];

    // Check if command is a path or a system command
    if (command.includes('/') || command.includes('\\')) {
      const exists = fs.existsSync(command);
      if (exists) {
        console.log(`  ✅ ${serverName}: ${command} exists`);
        results.passed.push(`MCP server ${serverName} binary exists`);
      } else {
        console.log(`  ⚠️  ${serverName}: ${command} does not exist`);
        results.warnings.push(`MCP server ${serverName} binary missing`);
      }
    } else {
      // System command like "node" or "python"
      console.log(`  ℹ️  ${serverName}: uses system command "${command}"`);
      // Check if the script file exists
      if (args.length > 0) {
        const scriptPath = args[0];
        const fullScriptPath = path.join('.', scriptPath);
        if (fs.existsSync(fullScriptPath)) {
          console.log(`  ✅ ${serverName}: script ${scriptPath} exists`);
          results.passed.push(`MCP server ${serverName} script exists`);
        } else {
          console.log(`  ⚠️  ${serverName}: script ${scriptPath} does not exist`);
          results.warnings.push(`MCP server ${serverName} script missing`);
        }
      }
    }

    if (serverConfig.optional) {
      console.log(`  ℹ️  ${serverName}: marked as optional`);
    }
  }
  console.log('');
} catch (err) {
  console.log(`  ❌ Failed to read .mcp.json: ${err.message}\n`);
  results.failed.push(`MCP config read failed: ${err.message}`);
}

// Test 4: Remotion project structure
console.log('TEST 4: Verifying Remotion project structure...');
const remotionProjectPath = '/Users/finessejones1/Documents/arise-remotion-projects';
const requiredFiles = [
  'package.json',
  'remotion.config.js',
  'remotion.config.mjs',
  'src/index.ts',
  'src/Root.tsx',
  'src/TitleCard.tsx',
];

let remotionProjectValid = true;
for (const file of requiredFiles) {
  const filePath = path.join(remotionProjectPath, file);

  // Special handling for config files - either .js or .mjs is acceptable
  if (file === 'remotion.config.js' || file === 'remotion.config.mjs') {
    const jsPath = path.join(remotionProjectPath, 'remotion.config.js');
    const mjsPath = path.join(remotionProjectPath, 'remotion.config.mjs');
    if (fs.existsSync(jsPath) || fs.existsSync(mjsPath)) {
      const actualConfig = fs.existsSync(jsPath) ? 'remotion.config.js' : 'remotion.config.mjs';
      console.log(`  ✅ ${actualConfig} exists`);
      results.passed.push(`Remotion config file exists (${actualConfig})`);
      continue;
    }
  }

  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file} exists`);
    results.passed.push(`Remotion project file ${file} exists`);
  } else {
    console.log(`  ❌ ${file} NOT FOUND`);
    results.failed.push(`Remotion project file ${file} missing`);
    remotionProjectValid = false;
  }
}

if (remotionProjectValid) {
  console.log('  ✅ Remotion project structure valid\n');
} else {
  console.log('  ❌ Remotion project structure incomplete\n');
}

// Test 5: Remotion connector initialization
console.log('TEST 5: Testing Remotion connector initialization...');
try {
  const initResult = await remotionConnector.initRemotion(remotionProjectPath);
  if (initResult.success) {
    console.log(`  ✅ Remotion initialized: ${initResult.projectPath}`);
    console.log(`  ✅ Mode: ${initResult.mode}`);
    results.passed.push('Remotion connector initialized successfully');
  } else {
    console.log(`  ⚠️  Remotion initialization failed: ${initResult.reason}`);
    console.log(`  ℹ️  Falling back to: ${initResult.mode}`);
    results.warnings.push(`Remotion init failed: ${initResult.reason}`);
  }
  console.log('');
} catch (err) {
  console.log(`  ❌ Remotion connector error: ${err.message}\n`);
  results.failed.push(`Remotion connector error: ${err.message}`);
}

// Test 6: FFmpeg status
console.log('TEST 6: Testing FFmpeg availability...');
try {
  const ffmpegStatus = await remotionConnector.checkFFmpegStatus();
  if (ffmpegStatus.available) {
    console.log(`  ✅ FFmpeg available: ${ffmpegStatus.path}`);
    console.log(`  ✅ Version: ${ffmpegStatus.version}`);
    results.passed.push('FFmpeg available and working');
  } else {
    console.log(`  ❌ FFmpeg not available: ${ffmpegStatus.error}`);
    results.failed.push(`FFmpeg not available: ${ffmpegStatus.error}`);
  }
  console.log('');
} catch (err) {
  console.log(`  ❌ FFmpeg check error: ${err.message}\n`);
  results.failed.push(`FFmpeg check error: ${err.message}`);
}

// Test 7: User config
console.log('TEST 7: Verifying user configuration...');
const userConfigPath = '/Users/finessejones1/.arise/config.json';
if (fs.existsSync(userConfigPath)) {
  console.log(`  ✅ User config exists: ${userConfigPath}`);
  try {
    const userConfig = JSON.parse(fs.readFileSync(userConfigPath, 'utf-8'));
    console.log(`  ✅ User config is valid JSON`);
    console.log(`  ℹ️  Remotion project path: ${userConfig.remotion?.projectPath}`);
    console.log(`  ℹ️  Companion mode: ${userConfig.companionMode?.enabled ? 'enabled' : 'disabled'}`);
    results.passed.push('User config valid');
  } catch (err) {
    console.log(`  ❌ User config is invalid JSON: ${err.message}`);
    results.failed.push(`User config invalid: ${err.message}`);
  }
} else {
  console.log(`  ⚠️  User config not found: ${userConfigPath}`);
  results.warnings.push('User config not found');
}
console.log('');

// Test 8: No Slop compliance check
console.log('TEST 8: No Slop compliance check...');
const remotionConnectorPath = path.join(__dirname, 'services/remotion-connector.js');
const connectorContent = fs.readFileSync(remotionConnectorPath, 'utf-8');

// Check for silent fallback pattern
const silentFallbackPattern = /if\s*\(!imagePattern\s*\|\|\s*!fs\.existsSync\(imagePattern\)\)\s*{\s*return\s*this\.renderCinematicVideoCard/;
if (silentFallbackPattern.test(connectorContent)) {
  console.log('  ❌ SILENT FALLBACK DETECTED - violates No Slop principle');
  results.failed.push('Silent fallback still present in remotion-connector.js');
} else {
  console.log('  ✅ No silent fallback detected');
  results.passed.push('No Slop compliant: no silent fallback');
}

// Check for error throwing instead
const errorThrowPattern = /throw new Error\([^)]*imagePattern[^)]*\)/;
if (errorThrowPattern.test(connectorContent)) {
  console.log('  ✅ Error throwing on missing input detected');
  results.passed.push('No Slop compliant: throws error on missing input');
} else {
  console.log('  ⚠️  Error throwing not confirmed');
  results.warnings.push('Error throwing pattern not confirmed');
}
console.log('');

// Summary
console.log('='.repeat(80));
console.log('VERIFICATION SUMMARY');
console.log('='.repeat(80));
console.log(`✅ Passed: ${results.passed.length}`);
console.log(`⚠️  Warnings: ${results.warnings.length}`);
console.log(`❌ Failed: ${results.failed.length}`);
console.log('');

if (results.passed.length > 0) {
  console.log('PASSED:');
  results.passed.forEach(r => console.log(`  ✅ ${r}`));
  console.log('');
}

if (results.warnings.length > 0) {
  console.log('WARNINGS:');
  results.warnings.forEach(r => console.log(`  ⚠️  ${r}`));
  console.log('');
}

if (results.failed.length > 0) {
  console.log('FAILED:');
  results.failed.forEach(r => console.log(`  ❌ ${r}`));
  console.log('');
}

console.log('='.repeat(80));

if (results.failed.length === 0) {
  console.log('✅ ALL CRITICAL TESTS PASSED');
  process.exit(0);
} else {
  console.log('❌ SOME TESTS FAILED - Review output above');
  process.exit(1);
}
