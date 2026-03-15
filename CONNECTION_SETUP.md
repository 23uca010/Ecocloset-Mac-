# 🚀 EcoCloset Connection Setup Guide

## 📋 **Prerequisites**

1. **Supabase Project**: Create a free account at https://supabase.com
2. **Project URL**: `https://oczrnrwmegbynppjqnfh.supabase.co`
3. **Anon Key**: Get from your Supabase project settings

---

## 🔧 **Step 1: Set Up Environment Variables**

### Create `.env.local` file:
```bash
# In frontend/.env.local
VITE_SUPABASE_URL=https://oczrnrwmegbynppjqnfh.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

### Where to get your Anon Key:
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the **anon public** key
4. Replace `your-supabase-anon-key-here` with your actual key

---

## 🗄️ **Step 2: Set Up Database**

### Run the Database Schema:
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `DATABASE_SETUP.sql`
4. Click **Run** to execute

### What the schema creates:
- ✅ `users` table - User profiles
- ✅ `items` table - Clothing items
- ✅ `ngos` table - NGO organizations
- ✅ `donations` table - Donation records
- ✅ `swaps` table - Item swaps
- ✅ Row Level Security (RLS) policies
- ✅ Sample NGOs for testing

---

## 🔐 **Step 3: Configure Authentication**

### Enable Authentication Providers:
1. Go to **Authentication** → **Settings** in Supabase
2. Enable **Email** provider
3. Set **Site URL** to: `http://localhost:3000`
4. Set **Redirect URLs** to: `http://localhost:3000/*`

### Email Settings (Optional):
- Enable email confirmation if desired
- Configure SMTP settings for production

---

## 🧪 **Step 4: Test Connection**

### Run Connection Tests:
1. Start your application: `npm start`
2. Go to http://localhost:3000
3. Click **"Run Connection Test"** button
4. Check all tests pass:
   - ✅ Basic Connection
   - ✅ Auth Service
   - ✅ Database Tables
   - ✅ Registration Test

### If Tests Fail:
- Check your `.env.local` file
- Verify Supabase URL and key
- Ensure database schema is set up
- Check authentication settings

---

## 🚀 **Step 5: Test Full Flow**

### Registration Test:
1. Go to http://localhost:3000/register
2. Fill form with real email
3. Submit registration
4. Should see success message
5. Click "Done" button
6. Should see welcome banner

### Login Test:
1. Go to http://localhost:3000/login
2. Use registered email/password
3. Should login successfully

---

## 🔍 **Troubleshooting**

### Common Issues:

#### "Database connection failed"
**Solution**: Check `.env.local` file and Supabase URL/key

#### "Email limit exceed"
**Solution**: Use real email addresses, not fake ones

#### "Registration failed"
**Solution**: 
- Check email format
- Ensure database schema is set up
- Verify authentication settings

#### "Connection test fails"
**Solution**:
- Verify Supabase project URL
- Check anon key is correct
- Ensure project is active

---

## 🌐 **Verification Checklist**

- [ ] `.env.local` file created with correct values
- [ ] Database schema executed in Supabase
- [ ] Authentication providers enabled
- [ ] Connection tests pass
- [ ] Registration works with real email
- [ ] Login works successfully
- [] Welcome banner appears after registration

---

## 🎯 **Expected Results**

After proper setup:
- ✅ All connection tests pass
- ✅ Users can register with real emails
- ✅ Users can login successfully
- ✅ Data is stored in Supabase tables
- ✅ Welcome experience works
- ✅ No connection errors

---

## 🚨 **Important Notes**

### Security:
- Never commit `.env.local` to git
- Keep your anon key private
- Use environment variables in production

### Email Requirements:
- **Real email addresses are required**
- No more fake `@example.com` emails
- Prevents rate limiting issues

### Database:
- Schema must be set up before testing
- RLS policies ensure data security
- Sample data helps with testing

---

## 🎉 **Ready to Go!**

Once all steps are completed, your EcoCloset application will:
- Connect properly to Supabase
- Handle user registration/login
- Store data securely
- Provide excellent user experience
- Work without any signin issues

**🌱 Your sustainable fashion platform is ready!** ✨
