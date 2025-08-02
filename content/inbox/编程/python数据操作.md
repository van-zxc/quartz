标签: [[深度学习]] [[python]] [[编程]] 
# 从最基础的开始
``` python
#导入python库:pytorch
import pytorch
```
我们目前称具有不同维度的数组为==张量==. 一维张量为向量, 二维张量为矩阵. 

在python中, 我们一般使用arange来创建行向量. 其中arange()中间的参数就是这个行向量的长度, 会按照0~n-1的顺序依次排列. 默认整数, 也可以创建浮点数. 内存存储, 并且CPU计算. 
```python
x = torch.arange(16)
x

[0,1,2,3,4,5]
```
