import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Settings, User, Lock, UserPlus, Trash2, Save, Eye, EyeOff, AlertCircle, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Profile update schema
const profileSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  username: z.string().min(3, "Username minimal 3 karakter"),
  currentPassword: z.string().optional(),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.password && data.password.length > 0) {
    return data.password.length >= 6;
  }
  return true;
}, {
  message: "Password minimal 6 karakter",
  path: ["password"],
}).refine((data) => {
  if (data.password && data.password.length > 0) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.password && data.password.length > 0) {
    return !!data.currentPassword;
  }
  return true;
}, {
  message: "Password lama wajib diisi untuk mengubah password",
  path: ["currentPassword"],
});

// Create user schema
const createUserSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string(),
  role: z.string().default("admin"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type CreateUserFormData = z.infer<typeof createUserSchema>;

type User = {
  id: number;
  username: string;
  name: string;
  role: string;
  createdAt: string;
};

export default function PengaturanPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showCreateConfirmPassword, setShowCreateConfirmPassword] = useState(false);
  const { toast } = useToast();
  const qc = useQueryClient();

  // Get current user
  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => authFetch<User>("/api/users/me"),
  });

  // List all users
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => authFetch<User[]>("/api/users"),
  });

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      username: "",
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Create user form
  const createUserForm = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
      role: "admin",
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileFormData) =>
      authFetch<User>("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify({
          name: data.name,
          username: data.username,
          password: data.password || undefined,
          currentPassword: data.currentPassword || undefined,
        }),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["current-user"] });
      toast({ title: "Profil berhasil diperbarui" });
    },
    onError: (err) => {
      toast({
        title: "Gagal memperbarui profil",
        description: err instanceof Error ? err.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    },
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (data: CreateUserFormData) =>
      authFetch<User>("/api/users", {
        method: "POST",
        body: JSON.stringify({
          name: data.name,
          username: data.username,
          password: data.password,
          role: data.role,
        }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      createUserForm.reset();
      toast({ title: "Akun berhasil ditambahkan" });
    },
    onError: (err) => {
      toast({
        title: "Gagal menambahkan akun",
        description: err instanceof Error ? err.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: number) =>
      authFetch<void>(`/api/users/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "Akun berhasil dihapus" });
    },
    onError: (err) => {
      toast({
        title: "Gagal menghapus akun",
        description: err instanceof Error ? err.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    },
  });

  // Set form values when user data loads
  useEffect(() => {
    if (currentUser) {
      profileForm.reset({
        name: currentUser.name,
        username: currentUser.username,
        currentPassword: "",
        password: "",
        confirmPassword: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const onProfileSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const onCreateUserSubmit = (data: CreateUserFormData) => {
    createUserMutation.mutate(data);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Pengaturan
        </h1>
        <p className="text-slate-600">
          Kelola profil dan akun pengguna
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profil Saya
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Kelola Akun
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Ubah Profil</CardTitle>
                  <CardDescription>
                    Perbarui informasi akun Anda
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {isLoadingUser ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-sm text-slate-500">Memuat data profil...</p>
                </div>
              ) : (
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nama Lengkap</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Masukkan nama lengkap" 
                                {...field}
                                className="h-11"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Masukkan username" 
                                {...field}
                                className="h-11"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <div className="flex items-center gap-2 mb-4">
                        <Lock className="h-4 w-4 text-slate-500" />
                        <h3 className="font-semibold text-slate-900">Ubah Password</h3>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">
                        Kosongkan jika tidak ingin mengubah password
                      </p>

                      <div className="space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password Lama</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    type={showCurrentPassword ? "text" : "password"}
                                    placeholder="Masukkan password lama" 
                                    {...field}
                                    className="h-11 pr-10"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-11 w-10"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                  >
                                    {showCurrentPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password Baru</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input 
                                      type={showNewPassword ? "text" : "password"}
                                      placeholder="Masukkan password baru" 
                                      {...field}
                                      className="h-11 pr-10"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="absolute right-0 top-0 h-11 w-10"
                                      onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                      {showNewPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={profileForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Konfirmasi Password Baru</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input 
                                      type={showConfirmPassword ? "text" : "password"}
                                      placeholder="Konfirmasi password baru" 
                                      {...field}
                                      className="h-11 pr-10"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="absolute right-0 top-0 h-11 w-10"
                                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                      {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => profileForm.reset()}
                      >
                        Batal
                      </Button>
                      <Button 
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="bg-gradient-to-r from-primary to-primary/90"
                      >
                        {updateProfileMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Menyimpan...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Simpan Perubahan
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Management Tab */}
        <TabsContent value="users" className="space-y-6">
          {/* Create User Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <UserPlus className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle>Tambah Akun Baru</CardTitle>
                  <CardDescription>
                    Buat akun admin baru untuk sistem
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...createUserForm}>
                <form onSubmit={createUserForm.handleSubmit(onCreateUserSubmit)} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={createUserForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Lengkap</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan nama lengkap" {...field} className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createUserForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Masukkan username" {...field} className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={createUserForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showCreatePassword ? "text" : "password"}
                                placeholder="Masukkan password" 
                                {...field}
                                className="h-11 pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-11 w-10"
                                onClick={() => setShowCreatePassword(!showCreatePassword)}
                              >
                                {showCreatePassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createUserForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Konfirmasi Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showCreateConfirmPassword ? "text" : "password"}
                                placeholder="Konfirmasi password" 
                                {...field}
                                className="h-11 pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-11 w-10"
                                onClick={() => setShowCreateConfirmPassword(!showCreateConfirmPassword)}
                              >
                                {showCreateConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      type="submit"
                      disabled={createUserMutation.isPending}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    >
                      {createUserMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Menambahkan...
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Tambah Akun
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Users List Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Daftar Akun</CardTitle>
                  <CardDescription>
                    Kelola semua akun pengguna sistem
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {isLoadingUsers ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-sm text-slate-500">Memuat data akun...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Tidak ada akun</h3>
                  <p className="text-sm text-slate-500">Belum ada akun yang terdaftar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-primary/30 hover:bg-slate-50/50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-slate-900">{user.name}</p>
                            {user.id === currentUser?.id && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                Anda
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-600">
                            <span className="font-mono">@{user.username}</span>
                            <span>•</span>
                            <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                              {user.role}
                            </Badge>
                            <span>•</span>
                            <span className="text-xs">
                              Dibuat {new Date(user.createdAt).toLocaleDateString("id-ID")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.id !== currentUser?.id && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Akun</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus akun <strong>{user.name}</strong> ({user.username})?
                                  Tindakan ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteUserMutation.mutate(user.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
