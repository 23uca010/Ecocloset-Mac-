@echo off
cd /d "c:\Users\magli\Desktop\Ecocloset-Mac-"

:: Create folders
mkdir docs 2>nul
mkdir scripts 2>nul
mkdir backend\scripts 2>nul

echo === Moving .md files to docs/ ===
move "ACCOUNT_CREATES_UPDATED.md"         "docs\ACCOUNT_CREATION.md"
move "ACCOUNT_CREATION_ERROR_REMOVED.md"  "docs\ACCOUNT_CREATION_ERRORS.md"
move "COMPLETE_DATABASE_CONNECTION.md"    "docs\DATABASE_CONNECTION.md"
move "COMPLETE_SUPABASE_CONNECTION.md"    "docs\SUPABASE_CONNECTION.md"
move "CONNECTION_SETUP.md"               "docs\CONNECTION_SETUP.md"
move "CREATE_ACCOUNT_BUTTON_FIXED.md"    "docs\CREATE_ACCOUNT_BUTTON.md"
move "EMAIL_FORMAT_USERNAME.md"          "docs\EMAIL_FORMAT.md"
move "EMAIL_RATE_LIMIT_REMOVED.md"       "docs\EMAIL_RATE_LIMIT.md"
move "EXACT_FIGMA_DESIGN.md"            "docs\FIGMA_DESIGN.md"
move "FIGMA_DESIGN_IMPLEMENTED.md"       "docs\FIGMA_IMPLEMENTED.md"
move "INVALID_CREDENTIALS_DEBUG.md"      "docs\INVALID_CREDENTIALS.md"
move "LIST_YOUR_ITEM_ONLY.md"           "docs\LIST_ITEM_ONLY.md"
move "LOGIN_REDIRECT_TO_SELLSWAP.md"     "docs\LOGIN_REDIRECT.md"
move "MODERNHOME_JSX_ERROR_FIXED.md"    "docs\JSX_ERROR_FIX.md"
move "PACKAGE_JSON_ANALYSIS_AND_FIX.md" "docs\PACKAGE_JSON_FIX.md"
move "QUICK_ACCESS_GUIDE.md"            "docs\QUICK_ACCESS_GUIDE.md"
move "SELL_SWAP_FORM_DESIGN_UPDATED.md" "docs\SELL_SWAP_DESIGN.md"
move "SIGN_IN_NEAR_CART.md"             "docs\SIGN_IN_CART.md"
move "SIGN_UP_PAGE_REMOVED.md"          "docs\SIGN_UP_REMOVED.md"
move "SIMPLE_LOGIN_IMPLEMENTED.md"      "docs\SIMPLE_LOGIN.md"
move "STARTUP_INSTRUCTIONS.md"          "docs\STARTUP_INSTRUCTIONS.md"
move "USERNAME_ONLY_LOGIN.md"           "docs\USERNAME_LOGIN.md"
move "USER_CREATION_ERROR_DEBUG.md"     "docs\USER_CREATION_DEBUG.md"
move "WEBSITE_LINKS_FINAL.md"           "docs\WEBSITE_LINKS_FINAL.md"
move "WEBSITE_LINKS_WORKING.md"         "docs\WEBSITE_LINKS.md"

echo === Moving SQL files to docs/ ===
move "DATABASE_SETUP.sql"               "docs\DATABASE_SETUP.sql"
move "supabase-schema.sql"              "docs\supabase-schema.sql"

echo === Moving API doc from backend to docs/ ===
move "backend\API_DOCUMENTATION.md"     "docs\API_DOCUMENTATION.md"

echo === Moving .bat files to scripts/ ===
move "CREATE_PUBLIC_LINK.bat"           "scripts\create-public-link.bat"
move "FIX_LOCALHOST_COMPLETE.bat"       "scripts\fix-localhost.bat"
move "NGROK_HELPER.bat"                 "scripts\ngrok-helper.bat"
move "QUICK_START.bat"                  "scripts\quick-start.bat"
move "START_APPLICATIONS.bat"           "scripts\start-applications.bat"
move "START_ECOLOSET.bat"              "scripts\start-ecocloset.bat"
move "START_FIGMA_WEBSITE.bat"          "scripts\start-figma-website.bat"
move "START_PUBLIC_ACCESS.bat"          "scripts\start-public-access.bat"

echo === Moving JS utility scripts to scripts/ ===
move "GENERATE_PUBLIC_LINK.js"          "scripts\generate-public-link.js"
move "capture_db.js"                    "scripts\capture-db.js"
move "check_columns.js"                 "scripts\check-columns.js"
move "debug_db.js"                      "scripts\debug-db.js"
move "env_debug.js"                     "scripts\env-debug.js"
move "generate-all-qr-options.js"       "scripts\generate-all-qr-options.js"
move "generate-network-qr.js"           "scripts\generate-network-qr.js"
move "generate-qr.js"                   "scripts\generate-qr.js"
move "migrate_swaps.js"                 "scripts\migrate-swaps.js"
move "run_migration.js"                 "scripts\run-migration.js"
move "setup-public-access.js"           "scripts\setup-public-access.js"

echo === Moving HTML QR files to scripts/ ===
move "ECOCLOSET_PUBLIC_LINK.html"       "scripts\ecocloset-public-link.html"
move "QUICK_QR_UPDATE.html"             "scripts\quick-qr-update.html"
move "ecocloset-all-qr-codes.html"      "scripts\ecocloset-all-qr.html"
move "ecocloset-network-qr.html"        "scripts\ecocloset-network-qr.html"
move "ecocloset-public-access.html"     "scripts\ecocloset-public-access.html"
move "ecocloset-qr.html"               "scripts\ecocloset-qr.html"

echo === Moving misc to scripts/ ===
move "ngrok.zip"                        "scripts\ngrok.zip"

echo.
echo === Moving backend test/debug scripts to backend/scripts/ ===
move "backend\test-admin-api.js"        "backend\scripts\test-admin-api.js"
move "backend\test-create.js"           "backend\scripts\test-create.js"
move "backend\test-create2.js"          "backend\scripts\test-create2.js"
move "backend\test-express.js"          "backend\scripts\test-express.js"
move "backend\test-login-api.js"        "backend\scripts\test-login-api.js"
move "backend\test-node.js"             "backend\scripts\test-node.js"
move "backend\test-register-api.js"     "backend\scripts\test-register-api.js"
move "backend\test-routes.js"           "backend\scripts\test-routes.js"
move "backend\test-sqlite.js"           "backend\scripts\test-sqlite.js"
move "backend\testLogin.js"             "backend\scripts\testLogin.js"
move "backend\testLoginAPI.js"          "backend\scripts\testLoginAPI.js"
move "backend\test_api.js"              "backend\scripts\test_api.js"
move "backend\test_db.js"               "backend\scripts\test_db.js"
move "backend\check-db.js"             "backend\scripts\check-db.js"
move "backend\check_db.js"             "backend\scripts\check_db.js"
move "backend\check_items.js"          "backend\scripts\check_items.js"
move "backend\check_schema.js"         "backend\scripts\check_schema.js"
move "backend\debug_db.js"             "backend\scripts\debug_db.js"
move "backend\fix_db.js"               "backend\scripts\fix_db.js"
move "backend\fix_db_created_at.js"    "backend\scripts\fix_db_created_at.js"
move "backend\fix_db_schema.js"        "backend\scripts\fix_db_schema.js"
move "backend\hello.js"                "backend\scripts\hello.js"
move "backend\add_created_at.js"       "backend\scripts\add_created_at.js"
move "backend\add100Items.js"          "backend\scripts\add100Items.js"
move "backend\addAllCategoryItems.js"  "backend\scripts\addAllCategoryItems.js"
move "backend\addIndianPrices.js"      "backend\scripts\addIndianPrices.js"
move "backend\addSampleItems.js"       "backend\scripts\addSampleItems.js"
move "backend\createTestUser.js"       "backend\scripts\createTestUser.js"
move "backend\recreateTestUser.js"     "backend\scripts\recreateTestUser.js"
move "backend\init-supabase-db.js"     "backend\scripts\init-supabase-db.js"
move "backend\updateIndianPrices500to2500.js" "backend\scripts\updateIndianPrices500to2500.js"
move "backend\updatePricesDebug.js"    "backend\scripts\updatePricesDebug.js"
move "backend\verifyPrices.js"         "backend\scripts\verifyPrices.js"
move "backend\server-simple.js"        "backend\scripts\server-simple.js"
move "backend\server-test.js"          "backend\scripts\server-test.js"
move "backend\server-working.js"       "backend\scripts\server-working.js"

echo === Cleaning up log files from backend/controllers/ ===
del "backend\controllers\swap_debug.log" 2>nul
del "backend\server_load_debug.log" 2>nul

echo === Removing leftover stray files ===
if exist "Extract" rmdir /s /q "Extract" 2>nul
if exist "backend\console.log('Response" del "backend\console.log('Response" 2>nul

echo.
echo ===== REORGANIZATION COMPLETE =====
