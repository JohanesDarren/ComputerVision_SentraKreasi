export async function verifyFacePresence(base64Data: string) {
  // Convert base64 to Blob
  const byteString = atob(base64Data.split(',')[1]);
  const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });
  
  const formData = new FormData();
  formData.append('file', blob, 'capture.jpg');

  const response = await fetch('http://localhost:8000/api/v1/verify-presence', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || 'Verifikasi wajah gagal');
  }

  return response.json();
}

export async function registerFace(pegawaiId: string, base64Datas: string[]) {
  const formData = new FormData();
  formData.append('pegawai_id', pegawaiId);

  base64Datas.forEach((base64Data, index) => {
    const byteString = atob(base64Data.split(',')[1]);
    const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    formData.append('files', blob, `register_${index}.jpg`);
  });

  const response = await fetch('http://localhost:8000/api/v1/register-face', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || 'Pendaftaran wajah gagal');
  }

  return response.json();
}
